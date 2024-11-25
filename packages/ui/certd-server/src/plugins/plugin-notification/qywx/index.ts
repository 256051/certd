import { BaseNotification, IsNotification, NotificationBody, NotificationInput } from '@certd/pipeline';

@IsNotification({
  name: 'qywx',
  title: '企业微信通知',
  desc: '企业微信群聊机器人通知',
})
export class QywxNotification extends BaseNotification {
  @NotificationInput({
    title: 'webhook地址',
    component: {
      placeholder: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxx',
    },
    helper: '[企微群聊机器人配置说明](https://developer.work.weixin.qq.com/document/path/91770)',
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
    helper: '填写成员名字，@all 为提醒所有人',
  })
  mentionedList!: string[];

  async send(body: NotificationBody) {
    if (!this.webhook) {
      throw new Error('webhook地址不能为空');
    }
    /**
     *
     *      "msgtype": "text",
     *      "text": {
     *          "content": "hello world"
     *      }
     *    }
     */

    await this.http.request({
      url: this.webhook,
      method: 'POST',
      data: {
        msgtype: 'markdown',
        markdown: {
          content: `# ${body.title}\n\n${body.content}\n[查看详情](${body.url})`,
          mentioned_list: this.mentionedList,
        },
      },
    });
  }
}
