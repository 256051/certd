import { IsAccess, AccessInput, BaseAccess } from '@certd/pipeline';

/**
 * 这个注解将注册一个授权配置
 * 在certd的后台管理系统中，用户可以选择添加此类型的授权
 */
@IsAccess({
  name: 'namesilo',
  title: 'namesilo授权',
  desc: '',
})
export class NamesiloAccess extends BaseAccess {
  /**
   * 授权属性配置
   */
  @AccessInput({
    title: 'API Key',
    component: {
      placeholder: 'api key',
    },
    helper: '前往 [获取API Key](https://www.namesilo.com/account/api-manager)',
    required: true,
    encrypt: true,
  })
  apiKey = '';
}

new NamesiloAccess();
