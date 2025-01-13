import { Provide } from '@midwayjs/core';
import { BaseService, Constants, CodeException, PageReq } from '@certd/lib-server';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OpenKeyEntity } from '../entity/open-key.js';
import { utils } from '@certd/basic';
import crypto from 'crypto';

export type OpenKey = {
  userId: number;
  keyId: string;
  keySecret: string;
  encrypt: boolean;
};
@Provide()
export class OpenKeyService extends BaseService<OpenKeyEntity> {
  @InjectEntityModel(OpenKeyEntity)
  repository: Repository<OpenKeyEntity>;

  //@ts-ignore
  getRepository() {
    return this.repository;
  }

  async page(pageReq: PageReq<OpenKeyEntity>) {
    return await super.page(pageReq);
  }

  async getKey(userId: number) {
    let entity = await this.getByUserId(userId);
    if (entity) {
      return {
        keyId: entity.keyId,
        keySecret: entity.keySecret,
      };
    }
    const keyId = utils.id.simpleNanoId(12) + '_key';
    const secretKey = crypto.randomBytes(32);
    const keySecret = secretKey.toString('base64');
    entity = new OpenKeyEntity();
    entity.userId = userId;
    entity.keyId = keyId;
    entity.keySecret = keySecret;
    await this.repository.save(entity);
    return {
      keyId: entity.keyId,
      keySecret: entity.keySecret,
    };
  }

  private getByUserId(userId: number) {
    return this.repository.findOne({ where: { userId } });
  }

  async getByKeyId(keyId: string) {
    return this.repository.findOne({ where: { keyId } });
  }

  async verifyOpenKey(openKey: string): Promise<OpenKey> {
    // openkey 组成，content = base64({keyId,t,encrypt,signType}) ,sign = md5({keyId,t,encrypt,signType}secret) , key = content.sign
    const [content, sign] = openKey.split('.');
    const contentJson = Buffer.from(content, 'base64').toString();
    const { keyId, t, encrypt, signType } = JSON.parse(contentJson);
    // 正负不超过3分钟 ,timestamps单位为秒
    if (Math.abs(Number(t) - Math.floor(Date.now() / 1000)) > 180) {
      throw new CodeException(Constants.res.openKeyExpiresError);
    }

    const entity = await this.getByKeyId(keyId);
    if (!entity) {
      throw new Error('openKey不存在');
    }
    const secret = entity.keySecret;
    let computedSign = '';
    if (signType === 'md5') {
      computedSign = utils.hash.md5(contentJson + secret);
    } else if (signType === 'sha256') {
      computedSign = utils.hash.sha256(contentJson + secret);
    } else {
      throw new CodeException(Constants.res.openKeySignTypeError);
    }
    if (computedSign !== sign) {
      throw new CodeException(Constants.res.openKeySignError);
    }

    if (!entity.userId) {
      throw new CodeException(Constants.res.openKeyError);
    }

    return {
      userId: entity.userId,
      keyId: entity.keyId,
      keySecret: entity.keySecret,
      encrypt: encrypt,
    };
  }
}
