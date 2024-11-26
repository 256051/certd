import { BaseNotification, IsNotification, NotificationBody, NotificationInput } from '@certd/pipeline';

@IsNotification({
  name: 'webhook',
  title: '自定义webhook',
  desc: '根据模版自定义http请求',
})
export class WebhookNotification extends BaseNotification {
  @NotificationInput({
    title: 'webhook地址',
    component: {
      placeholder: '',
    },
    required: true,
  })
  webhook = '';

  @NotificationInput({
    title: '请求方式',
    value: 'post',
    component: {
      name: 'a-select',
      placeholder: 'post/put',
      options: [
        { value: 'post', label: 'post' },
        { value: 'put', label: 'put' },
      ],
    },
    required: true,
  })
  method = '';

  @NotificationInput({
    title: 'ContentType',
    value: 'json',
    component: {
      name: 'a-select',
      options: [
        { value: 'application/json', label: 'json' },
        { value: 'application/x-www-form-urlencoded', label: 'x-www-form-urlencoded' },
      ],
    },
    required: true,
  })
  contentType = '';

  @NotificationInput({
    title: 'Headers',
    component: {
      name: 'a-textarea',
      vModel: 'value',
      rows: 3,
    },
    helper: '一行一个，格式为key:value',
    required: false,
  })
  headers = '';

  @NotificationInput({
    title: '消息body模版',
    value: `{
    "text":"{title}",
    "desp":"{content}\\n[查看详情]({url})"
}`,
    component: {
      name: 'a-textarea',
      rows: 4,
    },
    col: {
      span: 24,
    },
    helper: `根据实际的webhook接口，构建一个json对象作为参数，支持变量：{title}、{content}、{url}，变量用{}包裹，字符串需要双引号`,
    required: true,
  })
  template = '';

  async send(body: NotificationBody) {
    if (!this.template) {
      throw new Error('模版不能为空');
    }

    const bodyStr = this.template.replaceAll('{title}', body.title).replaceAll('{content}', body.content).replaceAll('{url}', body.url);

    const data = JSON.parse(bodyStr);

    const headers: any = {};
    if (this.headers && this.headers.trim()) {
      this.headers.split('\n').forEach(item => {
        item = item.trim();
        if (item) {
          const [key, value] = item.split(':');
          headers[key] = value;
        }
      });
    }

    try {
      await this.http.request({
        url: this.webhook,
        method: this.method,
        headers: {
          'Content-Type': `${this.contentType}; charset=UTF-8`,
          ...headers,
        },
        data: data,
      });
    } catch (e) {
      if (e.response?.data) {
        throw new Error(e.message + ',' + JSON.stringify(e.response.data));
      }
      throw e;
    }
  }
}
