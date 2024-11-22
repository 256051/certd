import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { BaseService, ValidateException } from '@certd/lib-server';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../entity/notification.js';
import { notificationRegistry } from '@certd/pipeline';

@Provide()
@Scope(ScopeEnum.Singleton)
export class NotificationService extends BaseService<NotificationEntity> {
  @InjectEntityModel(NotificationEntity)
  repository: Repository<NotificationEntity>;

  //@ts-ignore
  getRepository() {
    return this.repository;
  }

  async getSimpleInfo(id: number) {
    const entity = await this.info(id);
    if (entity == null) {
      throw new ValidateException('该通知配置不存在,请确认是否已被删除');
    }
    return {
      id: entity.id,
      name: entity.name,
      userId: entity.userId,
    };
  }

  getDefineList() {
    return notificationRegistry.getDefineList();
  }

  getDefineByType(type: string) {
    return notificationRegistry.getDefine(type);
  }
}
