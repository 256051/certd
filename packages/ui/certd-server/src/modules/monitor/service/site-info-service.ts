import { Provide } from '@midwayjs/core';
import { BaseService } from '@certd/lib-server';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { SiteInfoEntity } from '../entity/site-info.js';

@Provide()
export class SiteInfoService extends BaseService<SiteInfoEntity> {
  @InjectEntityModel(SiteInfoEntity)
  repository: Repository<SiteInfoEntity>;

  //@ts-ignore
  getRepository() {
    return this.repository;
  }

  async getUserMonitorCount(userId: number) {
    if (!userId) {
      throw new Error('userId is required');
    }
    return await this.repository.count({
      where: { userId },
    });
  }
}
