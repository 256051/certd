import { BaseNotification, IsNotification, NotificationBody, NotificationInput } from '@certd/pipeline';

@IsNotification({
  name: 'discord',
  title: 'Discord 通知',
  desc: 'Discord 机器人通知',
})
export class DiscordNotification extends BaseNotification {
  @NotificationInput({
    title: 'Webhook URL',
    component: {
      placeholder: 'https://discord.com/api/webhooks/xxxxx/xxxx',
    },
    helper: '[Discord Webhook 说明](https://discord.com/developers/docs/resources/webhook#execute-webhook)',
    required: true,
  })
  webhook = '';

  @NotificationInput({
    title: '提醒指定成员',
    component: {
      name: 'a-select',
      vModel: 'value',
      mode: 'tags',
      open: false,
    },
    required: false,
    helper: '填写成员的Id，或者角色Id（&id），或者everyone',
  })
  mentionedList!: string[];

  async send(body: NotificationBody) {
    if (!this.webhook) {
      throw new Error('Webhook URL 不能为空');
    }

    // 创建 Discord 消息体
    let content = `${body.title}\n${body.content}\n[查看详情](${body.url})`;
    if (this.mentionedList && this.mentionedList.length > 0) {
      content += `\n${this.mentionedList.map(item => `<@${item}>  `).join('')}`;
    }

    const json = {
      content: content,
    };

    await this.http.request({
      url: this.webhook,
      method: 'POST',
      data: json,
    });
  }
}
