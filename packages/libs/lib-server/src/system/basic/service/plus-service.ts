import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { PlusRequestService } from '@certd/plus-core';
import { logger } from '@certd/basic';
import { SysInstallInfo, SysLicenseInfo, SysSettingsService } from '../../settings/index.js';

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

  async getAccessToken() {
    const plusRequestService = await this.getPlusRequestService();
    await this.register();
    return await plusRequestService.getAccessToken();
  }
}
