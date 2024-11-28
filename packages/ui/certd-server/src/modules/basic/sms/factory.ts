import { AliyunSmsService } from './aliyun-sms.js';

export class SmsServiceFactory {
  static createSmsService(type: string) {
    switch (type) {
      case 'aliyun':
        return new AliyunSmsService();
      default:
        throw new Error('不支持的短信服务类型');
    }
  }
}
