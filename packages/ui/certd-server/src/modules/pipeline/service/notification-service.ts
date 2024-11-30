import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { BaseService, ValidateException } from '@certd/lib-server';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../entity/notification.js';
import { NotificationInstanceConfig, notificationRegistry } from '@certd/pipeline';

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

  async getById(id: number, userId: number): Promise<NotificationInstanceConfig> {
    if (!id) {
      throw new ValidateException('id不能为空');
    }
    if (!userId) {
      throw new ValidateException('userId不能为空');
    }
    const res = await this.repository.findOne({
      where: {
        id,
        userId,
      },
    });
    if (!res) {
      throw new ValidateException(`通知配置不存在<${id}>`);
    }
    return this.buildNotificationInstanceConfig(res);
  }

  private buildNotificationInstanceConfig(res: NotificationEntity) {
    const setting = JSON.parse(res.setting);
    return {
      id: res.id,
      type: res.type,
      name: res.name,
      userId: res.userId,
      setting,
    };
  }

  async getDefault(userId: number): Promise<NotificationInstanceConfig> {
    const res = await this.repository.findOne({
      where: {
        userId,
      },
      order: {
        isDefault: 'DESC',
      },
    });
    if (!res) {
      return null;
    }
    return this.buildNotificationInstanceConfig(res);
  }

  async setDefault(id: number, userId: number) {
    if (!id) {
      throw new ValidateException('id不能为空');
    }
    if (!userId) {
      throw new ValidateException('userId不能为空');
    }
    await this.repository.update(
      {
        userId,
      },
      {
        isDefault: false,
      }
    );
    await this.repository.update(
      {
        id,
        userId,
      },
      {
        isDefault: true,
      }
    );
  }
}
