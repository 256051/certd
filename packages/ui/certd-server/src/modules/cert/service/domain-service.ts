import {Inject, Provide, Scope, ScopeEnum} from '@midwayjs/core';
import {InjectEntityModel} from '@midwayjs/typeorm';
import {Not, Repository} from 'typeorm';
import {AccessService, BaseService} from '@certd/lib-server';
import {DomainEntity} from '../entity/domain.js';


/**
 *
 */
@Provide()
@Scope(ScopeEnum.Request, {allowDowngrade: true})
export class DomainService extends BaseService<DomainEntity> {
  @InjectEntityModel(DomainEntity)
  repository: Repository<DomainEntity>;

  @Inject()
  accessService: AccessService;

  //@ts-ignore
  getRepository() {
    return this.repository;
  }

  async add(param) {
    if (param.userId == null ){
      throw new Error('userId 不能为空');
    }
    if (!param.domain) {
      throw new Error('domain 不能为空');
    }
    const old = await this.repository.findOne({
      where: {
        domain: param.domain,
        userId: param.userId
      }
    });
    if (old) {
      throw new Error(`域名（${param.domain}）不能重复`);
    }
    return await super.add(param);
  }

  async update(param) {
    if (!param.id) {
      throw new Error('id 不能为空');
    }
    const old = await this.info(param.id)
    if (!old) {
      throw new Error('domain记录不存在');
    }

    const same = await this.repository.findOne({
      where: {
        domain: param.domain,
        userId: old.userId,
        id: Not(param.id)
      }
    });

    if (same) {
      throw new Error(`域名（${param.domain}）不能重复`);
    }
    delete param.userId
    return await super.update(param);


  }

}
