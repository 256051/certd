import { Provide } from '@midwayjs/core';
import { BaseService } from '@certd/lib-server';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CertInfoEntity } from '../entity/cert-info.js';

@Provide()
export class CertInfoService extends BaseService<CertInfoEntity> {
  @InjectEntityModel(CertInfoEntity)
  repository: Repository<CertInfoEntity>;

  //@ts-ignore
  getRepository() {
    return this.repository;
  }

  async getUserDomainCount(userId: number) {
    if (!userId) {
      throw new Error('userId is required');
    }
    return await this.repository.sum('domainCount', {
      userId,
    });
  }

  async updateDomains(pipelineId: number, domains: string[]) {
    const found = await this.repository.findOne({
      where: {
        pipelineId,
      },
    });
    const bean = new CertInfoEntity();
    if (found) {
      //bean
      bean.id = found.id;
    } else {
      //create
      bean.pipelineId = pipelineId;
    }

    bean.domain = domains[0];
    bean.domains = domains.join(',');
    bean.domainCount = domains.length;

    await this.addOrUpdate(bean);
  }
}
