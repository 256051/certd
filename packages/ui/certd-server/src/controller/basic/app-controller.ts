import { Controller, Get, Provide } from '@midwayjs/core';
import { BaseController, Constants } from '@certd/lib-server';
import { http, logger } from '@certd/basic';
/**
 */
@Provide()
@Controller('/api/app/')
export class AppController extends BaseController {
  @Get('/latest', { summary: Constants.per.authOnly })
  async latest(): Promise<any> {
    const res = await http.request({
      url: 'https://registry.npmmirror.com/@certd/pipeline',
      method: 'get',
    });
    try {
      const latest = res['dist-tags'].latest;
      return this.ok(latest);
    } catch (e: any) {
      logger.error(e);
      return this.ok('');
    }
  }
}
