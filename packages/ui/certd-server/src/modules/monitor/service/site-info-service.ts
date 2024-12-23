import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@certd/lib-server';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { SiteInfoEntity } from '../entity/site-info.js';
import { siteTester } from './site-tester.js';
import dayjs from 'dayjs';
import { logger } from '@certd/basic';
import { PeerCertificate } from 'tls';
import { NotificationService } from '../../pipeline/service/notification-service.js';

@Provide()
export class SiteInfoService extends BaseService<SiteInfoEntity> {
  @InjectEntityModel(SiteInfoEntity)
  repository: Repository<SiteInfoEntity>;

  @Inject()
  notificationService: NotificationService;

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

  /**
   * 检查站点证书过期时间
   * @param site
   * @param notify
   */
  async doCheck(site: SiteInfoEntity, notify = true) {
    if (!site?.domain) {
      throw new Error('站点域名不能为空');
    }
    try {
      const res = await siteTester.test({
        host: site.domain,
        port: site.httpsPort,
      });

      const certi: PeerCertificate = res.certificate;
      if (!certi) {
        return;
      }
      const expires = certi.valid_to;
      const domains = [certi.subject?.CN, ...certi.subjectaltname?.replaceAll('DNS:', '').split(',')];
      const issuer = `${certi.issuer.O}<${certi.issuer.CN}>`;
      const isExpired = dayjs().valueOf() > dayjs(expires).valueOf();
      const status = isExpired ? 'expired' : 'ok';
      const updateData = {
        id: site.id,
        certDomains: domains.join(','),
        certStatus: status,
        certProvider: issuer,
        certExpiresTime: dayjs(expires).valueOf(),
        lastCheckTime: dayjs().valueOf(),
        error: null,
        checkStatus: 'ok',
      };

      await this.update(updateData);
      if (!notify) {
        return;
      }
      try {
        await this.sendExpiresNotify(site);
      } catch (e) {
        logger.error('send notify error', e);
      }
    } catch (e) {
      logger.error('check site error', e);
      await this.update({
        id: site.id,
        checkStatus: 'error',
        lastCheckTime: dayjs().valueOf(),
        error: e.message,
      });
      if (!notify) {
        return;
      }
      try {
        await this.sendCheckErrorNotify(site);
      } catch (e) {
        logger.error('send notify error', e);
      }
    }
  }

  /**
   * 检查，但不发邮件
   * @param id
   * @param notify
   */
  async check(id: number, notify = false) {
    const site = await this.info(id);
    if (!site) {
      throw new Error('站点不存在');
    }
    return await this.doCheck(site, notify);
  }

  async sendCheckErrorNotify(site: SiteInfoEntity) {
    const url = await this.notificationService.getBindUrl('#/certd/monitor/site');
    // 发邮件
    await this.notificationService.send(
      {
        useDefault: true,
        logger: logger,
        body: {
          url,
          title: `站点证书检查出错<${site.name}>`,
          content: `站点名称： ${site.name} \n
站点域名： ${site.domain} \n
错误信息：${site.error}`,
        },
      },
      site.userId
    );
  }
  async sendExpiresNotify(site: SiteInfoEntity) {
    const expires = site.certExpiresTime;
    const validDays = dayjs(expires).diff(dayjs(), 'day');
    const url = await this.notificationService.getBindUrl('#/monitor/site');
    const content = `站点名称： ${site.name} \n
站点域名： ${site.domain} \n
证书域名： ${site.certDomains} \n
证书颁发者： ${site.certProvider} \n
过期时间： ${dayjs(site.certExpiresTime).format('YYYY-MM-DD')} \n`;
    if (validDays >= 0 && validDays < 10) {
      // 发通知
      await this.notificationService.send(
        {
          useDefault: true,
          logger: logger,
          body: {
            title: `站点证书即将过期，剩余${validDays}天，<${site.name}>`,
            content,
            url,
          },
        },
        site.userId
      );
    } else if (validDays < 0) {
      //发过期通知
      await this.notificationService.send(
        {
          useDefault: true,
          logger: logger,
          body: {
            title: `站点证书已过期${-validDays}天<${site.name}>`,
            content,
            url,
          },
        },
        site.userId
      );
    }
  }

  async checkAll(userId: any) {
    if (!userId) {
      throw new Error('userId is required');
    }
    const sites = await this.repository.find({
      where: { userId },
    });
    for (const site of sites) {
      await this.doCheck(site);
    }
  }
}
