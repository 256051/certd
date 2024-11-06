import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { AppKey, PlusRequestService, verify } from '@certd/plus-core';
import { logger } from '@certd/basic';
import { SysInstallInfo, SysLicenseInfo, SysSettingsService } from '../../settings/index.js';

@Provide()
@Scope(ScopeEnum.Singleton)
export class PlusService {
  @Inject()
  sysSettingsService: SysSettingsService;

  async getPlusRequestService() {
    const subjectId = await this.getSubjectId();
    return new PlusRequestService({ subjectId });
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

    return await verify({
      subjectId: installInfo.siteId,
      license: licenseInfo.license,
      bindUrl: installInfo?.bindUrl,
    });
  }

  async bindUrl(url: string) {
    const plusRequestService = await this.getPlusRequestService();
    return await plusRequestService.bindUrl(url);
  }

  async register() {
    const plusRequestService = await this.getPlusRequestService();
    const licenseInfo: SysLicenseInfo = await this.sysSettingsService.getSetting(SysLicenseInfo);
    const installInfo: SysInstallInfo = await this.sysSettingsService.getSetting(SysInstallInfo);
    if (!licenseInfo?.license) {
      //还没有license，注册一个
      const license = await plusRequestService.register({
        installTime: installInfo.installTime,
      });
      if (license) {
        await this.updateLicense(license);
        logger.info('站点注册成功');
      }
    }
  }
}
