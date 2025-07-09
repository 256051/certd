import {Inject, Provide, Scope, ScopeEnum} from '@midwayjs/core';
import {InjectEntityModel} from '@midwayjs/typeorm';
import {Repository} from 'typeorm';
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

}
