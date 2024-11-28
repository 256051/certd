import { Config, Inject, Provide } from '@midwayjs/core';
import { UserService } from '../../sys/authority/service/user-service.js';
import jwt from 'jsonwebtoken';
import { CommonException } from '@certd/lib-server';
import { RoleService } from '../../sys/authority/service/role-service.js';
import { UserEntity } from '../../sys/authority/entity/user.js';
import { SysSettingsService } from '@certd/lib-server';
import { SysPrivateSettings } from '@certd/lib-server';
import { cache } from '@certd/basic';
import { LoginErrorException } from '@certd/lib-server/dist/basic/exception/login-error-exception.js';

/**
 * 系统用户
 */
@Provide()
export class LoginService {
  @Inject()
  userService: UserService;
  @Inject()
  roleService: RoleService;
  @Config('auth.jwt')
  private jwt: any;

  @Inject()
  sysSettingsService: SysSettingsService;

  checkErrorTimes(username: string, errorMessage: string) {
    const cacheKey = `login_error_times:${username}`;
    const blockTimesKey = `login_block_times:${username}`;
    let blockTimes = cache.get(blockTimesKey);
    let maxWaitMin = 2;
    const maxRetryTimes = 5;
    if (blockTimes == null) {
      blockTimes = 1;
    }
    maxWaitMin = maxWaitMin * blockTimes;
    let ttl = maxWaitMin * 60 * 1000;

    let errorTimes = cache.get(cacheKey);

    if (errorTimes == null) {
      errorTimes = 0;
    } else {
      const remainingTTL = cache.getRemainingTTL(cacheKey);
      if (remainingTTL > 0) {
        ttl = remainingTTL;
      }
    }
    errorTimes += 1;

    cache.set(cacheKey, errorTimes, {
      ttl: ttl,
    });
    if (errorTimes >= maxRetryTimes) {
      if (errorTimes === maxRetryTimes) {
        blockTimes += 1;
        cache.set(blockTimesKey, blockTimes, {
          ttl: 24 * 60 * 60 * 1000,
        });
      }
      const leftMin = Math.ceil(ttl / 1000 / 60);
      throw new LoginErrorException(`登录失败次数过多，请${leftMin}分钟后重试`, 0);
    }
    const leftTimes = maxRetryTimes - errorTimes;
    if (leftTimes < 3) {
      throw new LoginErrorException(`登录失败，剩余尝试次数：${leftTimes}`, leftTimes);
    }
    throw new LoginErrorException(errorMessage, leftTimes);
  }

  async loginBySmsCode(req: { mobile: string; phoneCode: string; smsChecked: boolean }) {
    const { mobile, phoneCode, smsChecked } = req;
    if (!smsChecked) {
      this.checkErrorTimes(mobile, '验证码错误');
    }
    const info = await this.userService.findOne({ phoneCode, mobile: mobile });
    if (info == null) {
      throw new CommonException('手机号或验证码错误');
    }

    return this.onLoginSuccess(info);
  }

  async loginByPassword(req: { username: string; password: string; phoneCode: string }) {
    const { username, password, phoneCode } = req;
    const info = await this.userService.findOne([{ username: username }, { email: username }, { phoneCode, mobile: username }]);
    if (info == null) {
      throw new CommonException('用户名或密码错误');
    }
    const right = await this.userService.checkPassword(password, info.password, info.passwordVersion);
    if (!right) {
      this.checkErrorTimes(username, '用户名或密码错误');
    }
    return this.onLoginSuccess(info);
  }

  /**
   * login
   */
  async login(user) {
    console.assert(user.username != null, '用户名不能为空');
    const info = await this.userService.findOne({ username: user.username });
    if (info == null) {
      throw new CommonException('用户名或密码错误');
    }
    const right = await this.userService.checkPassword(user.password, info.password, info.passwordVersion);
    if (!right) {
      this.checkErrorTimes(user.username, '用户名或密码错误');
    }
    return await this.onLoginSuccess(info);
  }

  private async onLoginSuccess(info: UserEntity) {
    if (info.status === 0) {
      throw new CommonException('用户已被禁用');
    }
    const roleIds = await this.roleService.getRoleIdsByUserId(info.id);
    return this.generateToken(info, roleIds);
  }

  /**
   * 生成token
   * @param user 用户对象
   * @param roleIds
   */
  async generateToken(user: UserEntity, roleIds: number[]) {
    const tokenInfo = {
      username: user.username,
      id: user.id,
      roles: roleIds,
    };
    const expire = this.jwt.expire;

    const setting = await this.sysSettingsService.getSetting<SysPrivateSettings>(SysPrivateSettings);
    const jwtSecret = setting.jwtKey;

    const token = jwt.sign(tokenInfo, jwtSecret, {
      expiresIn: expire,
    });

    return {
      token,
      expire,
    };
  }
}
