import { ALL, Body, Controller, Inject, Post, Provide, Query } from '@midwayjs/core';
import { Constants, CrudController } from '@certd/lib-server';
import { AuthService } from '../../../modules/sys/authority/service/auth-service.js';
import { OpenKeyService } from '../../../modules/open/service/open-key-service.js';

/**
 */
@Provide()
@Controller('/api/open/key')
export class OpenKeyController extends CrudController<OpenKeyService> {
  @Inject()
  service: OpenKeyService;
  @Inject()
  authService: AuthService;

  getService(): OpenKeyService {
    return this.service;
  }

  @Post('/page', { summary: Constants.per.authOnly })
  async page(@Body(ALL) body: any) {
    body.query = body.query ?? {};
    body.query.userId = this.getUserId();
    const res = await this.service.page({
      query: body.query,
      page: body.page,
      sort: body.sort,
    });
    return this.ok(res);
  }

  @Post('/list', { summary: Constants.per.authOnly })
  async list(@Body(ALL) body: any) {
    body.query = body.query ?? {};
    body.query.userId = this.getUserId();
    return await super.list(body);
  }

  @Post('/add', { summary: Constants.per.authOnly })
  async add() {
    const bean: any = {};
    bean.userId = this.getUserId();
    const res = await this.service.add(bean);
    return this.ok(res);
  }

  @Post('/update', { summary: Constants.per.authOnly })
  async update(@Body(ALL) bean) {
    await this.service.checkUserId(bean.id, this.getUserId());
    delete bean.userId;
    await this.service.update(bean);
    return this.ok();
  }
  @Post('/info', { summary: Constants.per.authOnly })
  async info(@Query('id') id: number) {
    await this.service.checkUserId(id, this.getUserId());
    return await super.info(id);
  }

  @Post('/delete', { summary: Constants.per.authOnly })
  async delete(@Query('id') id: number) {
    await this.service.checkUserId(id, this.getUserId());
    return await super.delete(id);
  }
}
