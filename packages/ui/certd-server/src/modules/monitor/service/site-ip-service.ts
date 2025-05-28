import {Inject, Provide, Scope, ScopeEnum} from "@midwayjs/core";
import {BaseService, SysSettingsService} from "@certd/lib-server";
import {InjectEntityModel} from "@midwayjs/typeorm";
import {Repository} from "typeorm";
import {SiteInfoEntity} from "../entity/site-info.js";
import {NotificationService} from "../../pipeline/service/notification-service.js";
import {UserSuiteService} from "@certd/commercial-core";
import {UserSettingsService} from "../../mine/service/user-settings-service.js";
import {SiteIpEntity} from "../entity/site-ip.js";
import dns from "dns";
import {logger, safePromise} from "@certd/basic";
import dayjs from "dayjs";
import {siteTester} from "./site-tester.js";
import {PeerCertificate} from "tls";

@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class SiteIpService extends BaseService<SiteIpEntity> {
  @InjectEntityModel(SiteIpEntity)
  repository: Repository<SiteIpEntity>;

  @Inject()
  notificationService: NotificationService;

  @Inject()
  sysSettingsService: SysSettingsService;

  @Inject()
  userSuiteService: UserSuiteService;

  @Inject()
  userSettingsService: UserSettingsService;

  //@ts-ignore
  getRepository() {
    return this.repository;
  }

  async add(data: SiteInfoEntity) {
    if (!data.userId) {
      throw new Error("userId is required");
    }
    data.disabled = false;
    return await super.add(data);
  }

  async update(data: any) {
    if (!data.id) {
      throw new Error("id is required");
    }
    delete data.userId;
    await super.update(data);
  }



  async sync(entity: SiteInfoEntity) {

    const domain = entity.domain;
    //从域名解析中获取所有ip
    const ips = await this.getAllIpsFromDomain(domain);
    if (ips.length === 0 ) {
      throw new Error(`没有发现${domain}的IP`)
    }
    //删除所有的ip
    await this.repository.delete({
      siteId: entity.id,
      from: "sync"
    });

    //添加新的ip
    for (const ip of ips) {
      await this.repository.save({
        ipAddress: ip,
        userId: entity.userId,
        siteId: entity.id,
        from: "sync",
        disabled:false,
      });
    }

    await this.checkAll(entity);

  }

  async check(ipId: number, domain: string, port: number) {
    if(!ipId){
      return
    }
    const entity = await this.info(ipId);
    if (!entity) {
      return;
    }
    try {
      await this.update({
        id: entity.id,
        checkStatus: "checking",
        lastCheckTime: dayjs().valueOf()
      });
      const res = await siteTester.test({
        host: domain,
        port: port,
        retryTimes: 3,
        ipAddress: entity.ipAddress
      });

      const certi: PeerCertificate = res.certificate;
      if (!certi) {
        throw new Error("没有发现证书");
      }
      const expires = certi.valid_to;
      const allDomains = certi.subjectaltname?.replaceAll("DNS:", "").split(",") || [];
      const mainDomain = certi.subject?.CN;
      let domains = allDomains;
      if (!allDomains.includes(mainDomain)) {
        domains = [mainDomain, ...allDomains];
      }
      const issuer = `${certi.issuer.O}<${certi.issuer.CN}>`;
      const isExpired = dayjs().valueOf() > dayjs(expires).valueOf();
      const status = isExpired ? "expired" : "ok";
      const updateData = {
        id: entity.id,
        certDomains: domains.join(","),
        certStatus: status,
        certProvider: issuer,
        certExpiresTime: dayjs(expires).valueOf(),
        lastCheckTime: dayjs().valueOf(),
        error: null,
        checkStatus: "ok"
      };

      await this.update(updateData);

    } catch (e) {
      logger.error("check site ip error", e);
      await this.update({
        id: entity.id,
        checkStatus: "error",
        lastCheckTime: dayjs().valueOf(),
        error: e.message
      });
    }
  }

  async checkAll(siteInfo: SiteInfoEntity) {
    const siteId = siteInfo.id;
    const ips = await this.repository.find({
      where: {
        siteId: siteId
      }
    });
    const domain = siteInfo.domain;
    const port = siteInfo.httpsPort;
    const promiseList = [];
    for (const ip of ips) {
      const func = async () => {
        try {
          await this.check(ip.id, domain, port);
        } catch (e) {
          logger.error("check site ip error", e);
        }
      }
      promiseList.push(func());
    }
    Promise.all(promiseList);
  }

  async getAllIpsFromDomain(domain: string) {
    const getFromV4 = safePromise<string[]>((resolve, reject) => {
      dns.resolve4(domain, (err, addresses) => {
        if (err) {
          logger.error(`[${domain}] resolve4 error`, err)
          resolve([])
          return;
        }
        resolve(addresses);
      });
    });

    const getFromV6 = safePromise<string[]>((resolve, reject) => {
      dns.resolve6(domain, (err, addresses) => {
        if (err) {
          logger.error("[${domain}] resolve6 error", err)
          resolve([])
          return;
        }
        resolve(addresses);
      });
    });

    return Promise.all([getFromV4, getFromV6]).then(res => {
      return [...res[0], ...res[1]];
    });
  }
}
