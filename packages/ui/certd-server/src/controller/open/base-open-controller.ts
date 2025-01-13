import { BaseController, Encryptor } from '@certd/lib-server';
import { OpenKey } from '../../modules/open/service/open-key-service.js';

export class BaseOpenController extends BaseController {
  ok(res: any) {
    const openKey: OpenKey = this.ctx.openKey;
    if (openKey.encrypt) {
      const data = JSON.stringify(res);
      const encryptor = new Encryptor(openKey.keySecret);
      const encrypted = encryptor.encrypt(data);
      return this.ok(encrypted);
    }
    super.ok(res);
  }
}
