import { CreateRecordOptions, DnsProviderContext, IDnsProvider, RemoveRecordOptions } from '@certd/plugin-cert';
import { PlusService } from '@certd/lib-server';

export type CnameProvider = {
  id: number;
  domain: string;
  title: string;
};
export const CommonProviders = [
  {
    id: -1,
    domain: 'cname.certd.com.cn',
    title: '公共CNAME服务',
  },
];

export class CommonDnsProvider implements IDnsProvider {
  ctx: DnsProviderContext;
  config: CnameProvider;
  plusService: PlusService;

  constructor(opts: { config: CnameProvider; plusService: PlusService }) {
    this.config = opts.config;
    this.plusService = opts.plusService;
  }

  async onInstance() {}
  async createRecord(options: CreateRecordOptions) {
    if (!this.config.domain.endsWith(options.domain)) {
      throw new Error('cname服务域名不匹配');
    }

    await this.plusService.register();

    const res = await this.plusService.requestWithoutSign({
      url: '/activation/certd/cname/recordCreate',
      data: {
        subjectId: this.plusService.getSubjectId(),
        domain: options.domain,
        hostRecord: options.hostRecord,
        recordValue: options.value,
        providerId: this.config.id,
      },
    });
    return res;
  }
  async removeRecord(options: RemoveRecordOptions<any>) {
    const res = await this.plusService.requestWithoutSign({
      url: '/activation/certd/cname/recordRemove',
      data: {
        subjectId: this.plusService.getSubjectId(),
        domain: options.recordReq.domain,
        hostRecord: options.recordReq.hostRecord,
        recordValue: options.recordReq.value,
        recordId: options.recordRes.id,
        providerId: this.config.id,
      },
    });
    return res;
  }
  setCtx(ctx: DnsProviderContext): void {
    this.ctx = ctx;
  }
}
