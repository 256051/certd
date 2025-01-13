import { ALL, Body, Controller, Get, Inject, Post, Provide, Query } from '@midwayjs/core';
import { CodeException, Constants, EncryptService } from '@certd/lib-server';
import { CertInfoService } from '../../modules/monitor/service/cert-info-service.js';
import { CertInfo } from '@certd/plugin-cert';
import { OpenKey } from '../../modules/open/service/open-key-service.js';
import { BaseOpenController } from './base-open-controller.js';

export type CertGetReq = {
  domains: string;
};

/**
 */
@Provide()
@Controller('/open/cert')
export class OpenCertController extends BaseOpenController {
  @Inject()
  certInfoService: CertInfoService;
  @Inject()
  encryptService: EncryptService;

  @Get('/get', { summary: Constants.per.open })
  @Post('/get', { summary: Constants.per.open })
  async get(@Body(ALL) bean: CertGetReq, @Query(ALL) query: CertGetReq) {
    const openKey: OpenKey = this.ctx.openKey;
    const userId = openKey.userId;
    if (!userId) {
      return Constants.res.openKeyError;
    }

    const domains = bean.domains || query.domains;
    if (!domains) {
      throw new CodeException(Constants.res.openParamError);
    }
    const domainArr = domains.split(',');
    const res: CertInfo = await this.certInfoService.getCertInfo({
      userId,
      domains: domainArr,
    });
    return this.ok(res);
  }
}
