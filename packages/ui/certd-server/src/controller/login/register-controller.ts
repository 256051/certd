import { ALL, Body, Controller, Inject, Post, Provide } from '@midwayjs/core';
import { BaseController, Constants, SysSettingsService } from '@certd/lib-server';
import { RegisterType, UserService } from '../../modules/sys/authority/service/user-service.js';
import { CodeService } from '../../modules/basic/service/code-service.js';

export type RegisterReq = {
  type: RegisterType;
  username: string;
  password: string;
  mobile: string;
  email: string;
  phoneCode?: string;

  validateCode: string;
  imageCode: string;
  randomStr: string;
};

/**
 */
@Provide()
@Controller('/api/')
export class RegisterController extends BaseController {
  @Inject()
  userService: UserService;
  @Inject()
  codeService: CodeService;

  @Inject()
  sysSettingsService: SysSettingsService;

  @Post('/register', { summary: Constants.per.guest })
  public async register(
    @Body(ALL)
    body: RegisterReq
  ) {
    const sysPublicSettings = await this.sysSettingsService.getPublicSettings();
    if (sysPublicSettings.registerEnabled === false) {
      throw new Error('当前站点已禁止自助注册功能');
    }

    if (body.type === 'username') {
      if (sysPublicSettings.usernameRegisterEnabled) {
        throw new Error('当前站点已禁止用户名注册功能');
      }
      const newUser = await this.userService.register(body.type, {
        username: body.username,
        password: body.password,
      } as any);
      return this.ok(newUser);
    } else if (body.type === 'mobile') {
      if (sysPublicSettings.mobileRegisterEnabled) {
        throw new Error('当前站点已禁止手机号注册功能');
      }
      //验证短信验证码
      await this.codeService.checkSmsCode({
        mobile: body.mobile,
        phoneCode: body.phoneCode,
        smsCode: body.validateCode,
        randomStr: body.randomStr,
        throwError: true,
      });
      const newUser = await this.userService.register(body.type, {
        phoneCode: body.phoneCode,
        mobile: body.mobile,
        password: body.password,
      } as any);
      return this.ok(newUser);
    } else if (body.type === 'email') {
      if (sysPublicSettings.emailRegisterEnabled === false) {
        throw new Error('当前站点已禁止Email注册功能');
      }
      this.codeService.checkEmailCode({
        email: body.email,
        randomStr: body.randomStr,
        validateCode: body.validateCode,
        throwError: true,
      });
      const newUser = await this.userService.register(body.type, {
        email: body.email,
        password: body.password,
      } as any);
      return this.ok(newUser);
    }
  }
}
