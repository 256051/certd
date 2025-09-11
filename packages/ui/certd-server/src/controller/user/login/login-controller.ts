import { ALL, Body, Controller, Inject, Post, Provide } from "@midwayjs/core";
import { LoginService } from "../../../modules/login/service/login-service.js";
import { AddonService, BaseController, Constants, SysPublicSettings, SysSettingsService } from "@certd/lib-server";
import { CodeService } from "../../../modules/basic/service/code-service.js";
import { checkComm } from "@certd/plus-core";
import { logger } from "@certd/basic";
import { ICaptchaAddon } from "../../../plugins/plugin-captcha/api.js";

/**
 */
@Provide()
@Controller('/api/')
export class LoginController extends BaseController {
  @Inject()
  loginService: LoginService;
  @Inject()
  codeService: CodeService;

  @Inject()
  sysSettingsService: SysSettingsService;
  @Inject()
  addonService: AddonService;

  @Post('/login', { summary: Constants.per.guest })
  public async login(
    @Body(ALL)
    body: any
  ) {
    await this.loginService.doCaptchaValidate({form:body.captcha})
    const token = await this.loginService.loginByPassword(body);
    this.writeTokenCookie(token);
    return this.ok(token);
  }

  private writeTokenCookie(token: { expire: any; token: any }) {
    this.ctx.cookies.set("certd_token", token.token, {
      maxAge: 1000 * token.expire
    });
  }

  @Post('/loginBySms', { summary: Constants.per.guest })
  public async loginBySms(
    @Body(ALL)
    body: any
  ) {
    const settings = await this.sysSettingsService.getSetting<SysPublicSettings>(SysPublicSettings);
    if (settings.smsLoginEnabled !== true) {
      throw new Error('当前站点禁止短信验证码登录');
    }
    checkComm();

    const token = await this.loginService.loginBySmsCode({
      phoneCode: body.phoneCode,
      mobile: body.mobile,
      smsCode: body.smsCode,
      randomStr: body.randomStr,
    });

    this.writeTokenCookie(token);

    return this.ok(token);
  }

  @Post('/loginByTwoFactor', { summary: Constants.per.guest })
  public async loginByTwoFactor(
    @Body(ALL)
    body: any
  ) {

    const token = await this.loginService.loginByTwoFactor({
      loginId: body.loginId,
      verifyCode: body.verifyCode,
    });

    this.writeTokenCookie(token);
    return this.ok(token);
  }

  @Post('/logout', { summary: Constants.per.authOnly })
  public logout() {
    this.ctx.cookies.set("certd_token", "", {
      maxAge: 0
    });
    return this.ok();
  }

  @Post('/captcha/getParams', { summary: Constants.per.guest })
  async getCaptchaParams() {

    const settings = await this.sysSettingsService.getPublicSettings()
    if (settings.captchaEnabled) {
      const addonId = settings.captchaAddonId;

      const addon:ICaptchaAddon = await this.addonService.getAddonById(addonId,true,0)
      if (!addon) {
        logger.warn('验证码插件还未配置')
        return this.ok({});
      }

      const params = await addon.getClientParams()
      return this.ok(params);
    }

    return this.ok({});
  }
}
