import {AbstractDnsProvider, CreateRecordOptions, IsDnsProvider, RemoveRecordOptions} from '@certd/plugin-cert';
import {RainyunAccess} from "./access.js";

@IsDnsProvider({
  name: 'rainyun',
  title: '雨云',
  desc: '雨云DNS解析提供商',
  accessType: 'rainyun',
  icon: 'svg:icon-lucky',
  order:0,
})
export class RainyunDnsProvider extends AbstractDnsProvider {

  client: any;
  async onInstance() {

  }

  async createRecord(options: CreateRecordOptions): Promise<any> {

    const access: RainyunAccess = this.ctx.access as RainyunAccess
    console.log(access)
    const { fullRecord,hostRecord, value, type, domain } = options;
    this.logger.info('添加域名解析：', fullRecord, value, domain);
    // const domain = await this.matchDomain(fullRecord);
    const params = {
      RegionId: 'cn-hangzhou',
      DomainName: domain,
      RR: hostRecord,
      Type: type,
      Value: value,
      // Line: 'oversea' // 海外
    };

    const requestOption = {
      method: 'POST',
    };
    try {
      const ret = await this.client.request('AddDomainRecord', params, requestOption);
      this.logger.info('添加域名解析成功:', JSON.stringify(options), ret.RecordId);
      return ret.RecordId;
    } catch (e: any) {
      if (e.code === 'DomainRecordDuplicate') {
        return;
      }
      if(e.code === "LastOperationNotFinished"){
        this.logger.info('上一个操作还未完成，5s后重试')
        await this.ctx.utils.sleep(5000)
        return this.createRecord(options)
      }
      this.logger.info('添加域名解析出错', e);
      this.resolveError(e, options);
    }
  }

  resolveError(e: any, req: CreateRecordOptions) {
    if (e.message?.indexOf('The specified domain name does not exist') > -1) {
      throw new Error(`阿里云账号中不存在此域名:${req.domain}`);
    }
    throw e;
  }
  async removeRecord(options: RemoveRecordOptions<any>): Promise<any> {
    const { fullRecord, value } = options.recordReq;
    const record = options.recordRes;
    const params = {
      RegionId: 'cn-hangzhou',
      RecordId: record,
    };

    const requestOption = {
      method: 'POST',
    };
    try{
      const ret = await this.client.request('DeleteDomainRecord', params, requestOption);
      this.logger.info('删除域名解析成功:', fullRecord, value, ret.RecordId);
      return ret.RecordId;
    }catch (e) {
      if(e.code === "LastOperationNotFinished"){
        this.logger.info('上一个操作还未完成，5s后重试')
        await this.ctx.utils.sleep(5000)
        return this.removeRecord(options)
      }
      throw e
    }
  }
}

new RainyunDnsProvider();
