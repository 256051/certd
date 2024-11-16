import { AbstractTaskPlugin, IsTaskPlugin, pluginGroups, RunStrategy, TaskInput } from '@certd/pipeline';
import { CertInfo, CertReader } from '@certd/plugin-cert';
import { createCertDomainGetterInputDefine, createRemoteSelectInputDefine } from '@certd/plugin-plus';
import { optionsUtils } from '@certd/basic/dist/utils/util.options.js';

@IsTaskPlugin({
  name: 'demoTest',
  title: 'Demo测试插件',
  icon: 'clarity:plugin-line',
  //插件分组
  group: pluginGroups.other.key,
  default: {
    strategy: {
      runStrategy: RunStrategy.SkipWhenSucceed,
    },
  },
})
export class DemoTestPlugin extends AbstractTaskPlugin {
  //测试参数
  @TaskInput({
    title: '属性示例',
    value: '默认值',
    component: {
      //前端组件配置，具体配置见组件文档 https://www.antdv.com/components/input-cn
      name: 'a-input',
    },
  })
  text!: string;

  //测试参数
  @TaskInput({
    title: '选择框',
    component: {
      //前端组件配置，具体配置见组件文档 https://www.antdv.com/components/select-cn
      name: 'a-auto-complete',
      vModel: 'value',
      options: [
        { value: '1', label: '选项1' },
        { value: '2', label: '选项2' },
      ],
    },
  })
  select!: string;

  //测试参数
  @TaskInput({
    title: 'switch',
    component: {
      //前端组件配置，具体配置见组件文档 https://www.antdv.com/components/switch-cn
      name: 'a-switch',
      vModel: 'checked',
    },
  })
  switch!: boolean;
  //证书选择，此项必须要有
  @TaskInput({
    title: '域名证书',
    helper: '请选择前置任务输出的域名证书',
    component: {
      name: 'output-selector',
      from: ['CertApply', 'CertApplyLego'],
    },
    // required: true, // 必填
  })
  cert!: CertInfo;

  @TaskInput(createCertDomainGetterInputDefine({ props: { required: false } }))
  //前端可以展示，当前申请的证书域名列表
  certDomains!: string[];

  //授权选择框
  @TaskInput({
    title: 'demo授权',
    helper: 'demoAccess授权',
    component: {
      name: 'access-selector',
      type: 'demo', //固定授权类型
    },
    // rules: [{ required: true, message: '此项必填' }],
    // required: true, //必填
  })
  accessId!: string;

  @TaskInput(
    createRemoteSelectInputDefine({
      title: '从后端获取选项',
      helper: '选择时可以从后端获取选项',
      typeName: 'demoTest',
      action: DemoTestPlugin.prototype.onGetSiteList.name,
      //当以下参数变化时，触发获取选项
      watches: ['certDomains', 'accessId'],
      required: true,
    })
  )
  siteName!: string | string[];

  //插件实例化时执行的方法
  async onInstance() {}

  //插件执行方法
  async execute(): Promise<void> {
    const { select, text, cert, accessId } = this;

    try {
      const access = await this.accessService.getById(accessId);
      this.logger.debug('access', access);
    } catch (e) {
      this.logger.error('获取授权失败', e);
    }

    try {
      const certReader = new CertReader(cert);
      this.logger.debug('certReader', certReader);
    } catch (e) {
      this.logger.error('读取crt失败', e);
    }

    this.logger.info('DemoTestPlugin execute');
    this.logger.info('text:', text);
    this.logger.info('select:', select);
    this.logger.info('switch:', this.switch);
    this.logger.info('授权id:', accessId);
  }

  //此方法演示，如何让前端在添加插件时可以从后端获取选项，这里是后端返回选项的方法
  async onGetSiteList() {
    if (!this.accessId) {
      throw new Error('请选择Access授权');
    }

    // @ts-ignore
    const access = await this.accessService.getById(this.accessId);

    // const siteRes = await this.ctx.http.request({
    //   url: '你的服务端获取选项的请求地址',
    //   method: 'GET',
    //   data: {
    //    token:access.xxxx
    //   }, //请求参数
    // });
    //以下是模拟数据
    const siteRes = [
      { id: 1, siteName: 'site1.com' },
      { id: 2, siteName: 'site2.com' },
      { id: 3, siteName: 'site2.com' },
    ];
    //转换为前端所需要的格式
    const options = siteRes.map((item: any) => {
      return {
        value: item.siteName,
        label: item.siteName,
        domain: item.siteName,
      };
    });
    //将站点域名名称根据证书域名进行匹配分组，分成匹配的和不匹配的两组选项，返回给前端，供用户选择
    return optionsUtils.buildGroupOptions(options, this.certDomains);
  }
}
//实例化一下，注册插件
new DemoTestPlugin();
