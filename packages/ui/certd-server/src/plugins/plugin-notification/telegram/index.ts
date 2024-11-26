import { BaseNotification, IsNotification, NotificationBody, NotificationInput } from '@certd/pipeline';

@IsNotification({
  name: 'telegram',
  title: 'Telegram通知',
  desc: 'Telegram Bot推送通知',
})
export class TelegramNotification extends BaseNotification {
  @NotificationInput({
    title: 'Bot Token',
    component: {
      placeholder: '123456789:ABCdefGhijklmnopqrstUVWXyz',
    },
    helper: '[token获取](https://core.telegram.org/bots/features#botfather)',
    required: true,
  })
  botToken = '';

  @NotificationInput({
    title: '聊天ID',
    component: {
      placeholder: '聊天ID，例如 -123456789 或 @channelusername',
    },
    helper: '聊天的唯一标识符或用户名',
    required: true,
  })
  chatId = '';

  async send(body: NotificationBody) {
    if (!this.botToken || !this.chatId) {
      throw new Error('Bot Token 和聊天ID不能为空');
    }

    // 构建消息内容
    const messageContent = `*${body.title}*\n\n${body.content}\n[查看详情](${body.url})`;

    // Telegram API URL
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    // 发送 HTTP 请求
    await this.http.request({
      url: url,
      method: 'POST',
      data: {
        chat_id: this.chatId,
        text: messageContent,
        parse_mode: 'MarkdownV2', // 或使用 'HTML' 取决于需要的格式
      },
    });
  }
}
