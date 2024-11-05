import { Config, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { AppKey, getPlusInfo, PlusRequestService, verify } from '@certd/plus-core';
import { logger } from '@certd/basic';
import { SysInstallInfo, SysLicenseInfo, SysSettingsService } from '../../settings/index.js';
@Provide()
@Scope(ScopeEnum.Singleton)
export class PlusService {
  @Inject()
  sysSettingsService: SysSettingsService;
  @Config('plus.server.baseUrls')
  plusServerBaseUrls: string[];

  async getPlusRequestService() {
    const subjectId = await this.getSubjectId();
    return new PlusRequestService({
      plusServerBaseUrls: this.plusServerBaseUrls,
      subjectId,
    });
  }

  async getSubjectId() {
    const installInfo: SysInstallInfo = await this.sysSettingsService.getSetting(SysInstallInfo);
    return installInfo.siteId;
  }

  async requestWithoutSign(config: any) {
    const plusRequestService = await this.getPlusRequestService();
    return await plusRequestService.requestWithoutSign(config);
  }
  async request(config: any) {
    const plusRequestService = await this.getPlusRequestService();
    return await plusRequestService.request(config);
  }

  async active(formData: { code: any; appKey: string; subjectId: string }) {
    const plusRequestService = await this.getPlusRequestService();
    return await plusRequestService.requestWithoutSign({
      url: '/activation/active',
      method: 'post',
      data: formData,
    });
  }

  async updateLicense(license: string) {
    let licenseInfo: SysLicenseInfo = await this.sysSettingsService.getSetting(SysLicenseInfo);
    if (!licenseInfo) {
      licenseInfo = new SysLicenseInfo();
    }
    licenseInfo.license = license;
    await this.sysSettingsService.saveSetting(licenseInfo);
    const verifyRes = await this.verify();
    if (!verifyRes.isPlus) {
      const message = verifyRes.message || '授权码校验失败';
      logger.error(message);
      throw new Error(message);
    }
  }
  async verify() {
    const licenseInfo: SysLicenseInfo = await this.sysSettingsService.getSetting(SysLicenseInfo);
    const installInfo: SysInstallInfo = await this.sysSettingsService.getSetting(SysInstallInfo);

    const plusRequestService = await this.getPlusRequestService();

    return await verify({
      subjectId: plusRequestService.subjectId,
      license: licenseInfo.license,
      plusRequestService: plusRequestService,
      bindUrl: installInfo?.bindUrl,
    });
  }

  async register() {
    const plusRequestService = await this.getPlusRequestService();
    const licenseInfo: SysLicenseInfo = await this.sysSettingsService.getSetting(SysLicenseInfo);
    const installInfo: SysInstallInfo = await this.sysSettingsService.getSetting(SysInstallInfo);
    if (!licenseInfo?.license) {
      //还没有license，注册一个
      const res = await plusRequestService.requestWithoutSign({
        url: '/activation/subject/register',
        data: {
          appKey: AppKey,
          subjectId: installInfo.siteId,
          installTime: installInfo.installTime,
        },
      });
      if (res.license) {
        await this.updateLicense(res.license);
        logger.info('站点注册成功');
      }
    }
  }

  async bindUrl(subjectId: string, url: string) {
    const plusRequestService = await this.getPlusRequestService();
    return await plusRequestService.request({
      url: '/activation/subject/urlBind',
      data: {
        subjectId,
        appKey: AppKey,
        url,
      },
    });
  }

  async register() {
    if (getPlusInfo().secret) {
      return;
    }
    const plusRequestService = await this.getPlusRequestService();
    const installInfo: SysInstallInfo = await this.sysSettingsService.getSetting(SysInstallInfo);
    const res = await plusRequestService.requestWithoutSign({
      url: '/activation/subject/register',
      method: 'post',
      data: {
        appKey: AppKey,
        subjectId: installInfo.siteId,
        installTime: installInfo.installTime,
      },
    });
    await this.updateLicense(res.license);
  }
}
