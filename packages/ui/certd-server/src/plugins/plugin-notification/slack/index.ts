import { BaseNotification, IsNotification, NotificationBody, NotificationInput } from '@certd/pipeline';

@IsNotification({
  name: 'slack',
  title: 'Slack通知',
  desc: 'Slack消息推送通知',
})
export class SlackNotification extends BaseNotification {
  @NotificationInput({
    title: 'webhook地址',
    component: {
      placeholder: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    },
    helper: '[APPS](https://api.slack.com/apps/)->进入APP->incoming-webhooks->Add New Webhook to Workspace',
    required: true,
  })
  webhook = '';

  async send(body: NotificationBody) {
    if (!this.webhook) {
      throw new Error('token不能为空');
    }

    await this.http.request({
      url: this.webhook,
      method: 'POST',
      data: {
        text: `${body.title}\n${body.content}\n[查看详情](${body.url})`,
      },
    });
  }
}
