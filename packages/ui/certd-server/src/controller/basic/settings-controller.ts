import { Config, Controller, Get, Inject, Provide } from "@midwayjs/core";
import {
  BaseController,
  Constants,
  SysHeaderMenus,
  SysInstallInfo,
  SysPublicSettings,
  SysSettingsService,
  SysSiteEnv,
  SysSiteInfo,
  SysSuiteSetting
} from "@certd/lib-server";
import { AppKey, getPlusInfo } from "@certd/plus-core";
import { cloneDeep } from "lodash-es";
import { getVersion } from "../../utils/version.js";
import { http } from "@certd/basic";

/**
 */
@Provide()
@Controller("/api/basic/settings")
export class BasicSettingsController extends BaseController {
  @Inject()
  sysSettingsService: SysSettingsService;
  @Config("account.server.baseUrl")
  accountServerBaseUrl: any;

  @Config("agent")
  agentConfig: SysSiteEnv["agent"];

  public async getSysPublic() {
    return await this.sysSettingsService.getSetting(SysPublicSettings);
  }

  public async getInstallInfo() {
    const settings: SysInstallInfo = await this.sysSettingsService.getSetting(SysInstallInfo);
    settings.accountServerBaseUrl = this.accountServerBaseUrl;
    settings.appKey = AppKey;
    return settings;
  }

  public async getSiteInfo() {
    return await this.sysSettingsService.getSetting(SysSiteInfo);
  }

  public async getHeaderMenus() {
    return await this.sysSettingsService.getSetting(SysHeaderMenus);
  }

  public async getSuiteSetting() {
    // VIP检查已移除，所有用户都可以使用套餐设置
    // if (!isComm()) {
    //   return { enabled: false };
    // }
    try {
      const setting = await this.sysSettingsService.getSetting<SysSuiteSetting>(SysSuiteSetting);
      return {
        enabled: setting.enabled
      };
    } catch (e) {
      return { enabled: false };
    }
  }

  public async getSiteEnv() {
    const env: SysSiteEnv = {
      agent: this.agentConfig
    };
    return env;
  }

  async plusInfo() {
    const res = getPlusInfo();
    const copy = cloneDeep(res);
    delete copy.secret;
    return copy;
  }

  @Get("/productInfo", { summary: Constants.per.guest })
  async getProductInfo() {
    const info = await http.request({
      url: "https://app.handfree.work/certd/info.json"
    });
    return this.ok(info);

  }

  @Get("/all", { summary: Constants.per.guest })
  async getAllSettings() {
    const sysPublic = await this.getSysPublic();
    const installInfo = await this.getInstallInfo();
    let siteInfo = {};
    // VIP检查已移除，所有用户都可以使用站点信息
    // if (isComm()) {
    //   siteInfo = await this.getSiteInfo();
    // }
    // 免费版也尝试获取站点信息
    try {
      siteInfo = await this.getSiteInfo();
    } catch (e) {
      // 忽略错误，使用默认值
    }
    const siteEnv = await this.getSiteEnv();
    const plusInfo = await this.plusInfo();
    const headerMenus = await this.getHeaderMenus();
    const suiteSetting = await this.getSuiteSetting();
    const version = await getVersion();
    return this.ok({
      sysPublic,
      installInfo,
      siteInfo,
      siteEnv,
      plusInfo,
      headerMenus,
      suiteSetting,
      app: {
        time: new Date().getTime(),
        version
      },
    });
  }
}
