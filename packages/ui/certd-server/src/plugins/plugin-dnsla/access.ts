import { IsAccess, AccessInput, BaseAccess } from '@certd/pipeline';

/**
 * 这个注解将注册一个授权配置
 * 在certd的后台管理系统中，用户可以选择添加此类型的授权
 */
@IsAccess({
  name: 'dnsla',
  title: 'dns.la授权',
  icon: 'arcticons:dns-changer-3',
  desc: '',
})
export class DnslaAccess extends BaseAccess {
  /**
   * 授权属性配置
   */
  @AccessInput({
    title: 'APIID',
    component: {
      placeholder: 'APIID',
    },
    helper:"从我的账户->API密钥中获取 APIID APISecret",
    required: true,
    encrypt: false,
  })
  apiId = '';

  @AccessInput({
    title: 'APISecret',
    component: {
      placeholder: '',
    },
    helper:
      '',
    required: false,
    encrypt: true,
  })
  apiSecret = '';
}

new DnslaAccess();
