import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { AppKey, PlusRequestService } from '@certd/plus-core';
import { http, HttpRequestConfig, logger } from '@certd/basic';
import { SysInstallInfo, SysLicenseInfo, SysSettingsService } from '../../settings/index.js';
import { merge } from 'lodash-es';

@Provide()
@Scope(ScopeEnum.Singleton)
export class PlusService {
  @Inject()
  sysSettingsService: SysSettingsService;

  plusRequestService: PlusRequestService;

  async getPlusRequestService() {
    if (this.plusRequestService) {
      return this.plusRequestService;
    }
    const installInfo: SysInstallInfo = await this.sysSettingsService.getSetting(SysInstallInfo);

    const subjectId = installInfo.siteId;
    const bindUrl = installInfo.bindUrl;
    const installTime = installInfo.installTime;
    const saveLicense = async (license: string) => {
      let licenseInfo: SysLicenseInfo = await this.sysSettingsService.getSetting(SysLicenseInfo);
      if (!licenseInfo) {
        licenseInfo = new SysLicenseInfo();
      }
      licenseInfo.license = license;
      await this.sysSettingsService.saveSetting(licenseInfo);
    };

    return new PlusRequestService({ subjectId, bindUrl, installTime, saveLicense });
  }

  async getSubjectId() {
    const installInfo: SysInstallInfo = await this.sysSettingsService.getSetting(SysInstallInfo);
    return installInfo.siteId;
  }

  async active(code: string) {
    const plusRequestService = await this.getPlusRequestService();
    return await plusRequestService.active(code);
  }

  async updateLicense(license: string) {
    const plusRequestService = await this.getPlusRequestService();
    await plusRequestService.updateLicense({ license });
  }
  async verify() {
    const plusRequestService = await this.getPlusRequestService();
    const licenseInfo: SysLicenseInfo = await this.sysSettingsService.getSetting(SysLicenseInfo);
    await plusRequestService.verify({ license: licenseInfo.license });
  }

  async bindUrl(url: string) {
    const plusRequestService = await this.getPlusRequestService();
    return await plusRequestService.bindUrl(url);
  }

  async register() {
    const plusRequestService = await this.getPlusRequestService();
    const licenseInfo: SysLicenseInfo = await this.sysSettingsService.getSetting(SysLicenseInfo);
    if (!licenseInfo.license) {
      await plusRequestService.register();
      logger.info('站点注册成功');
    }
  }

  async userPreBind(userId: number) {
    const plusRequestService = await this.getPlusRequestService();
    await plusRequestService.requestWithoutSign({
      url: '/activation/subject/preBind',
      method: 'POST',
      data: {
        userId,
        appKey: AppKey,
        subjectId: this.getSubjectId(),
      },
    });
  }

  async sendEmail(email: any) {
    const plusRequestService = await this.getPlusRequestService();
    await plusRequestService.request({
      url: '/activation/emailSend',
      data: {
        subject: email.subject,
        text: email.content,
        to: email.receivers,
      },
    });
  }

  async getAccessToken() {
    const plusRequestService = await this.getPlusRequestService();
    await this.register();
    return await plusRequestService.getAccessToken();
  }

  async requestWithToken(config: HttpRequestConfig) {
    const plusRequestService = await this.getPlusRequestService();
    const token = await this.getAccessToken();
    merge(config, {
      baseURL: plusRequestService.getBaseURL(),
      headers: {
        Authorization: token,
      },
    });
    return await http.request(config);
  }
}
