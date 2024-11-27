import { ALL, Body, Controller, Inject, Post, Provide, Query } from '@midwayjs/core';
import { Constants, CrudController, ValidateException } from '@certd/lib-server';
import { NotificationService } from '../../modules/pipeline/service/notification-service.js';
import { AuthService } from '../../modules/sys/authority/service/auth-service.js';

/**
 * 通知
 */
@Provide()
@Controller('/api/pi/notification')
export class NotificationController extends CrudController<NotificationService> {
  @Inject()
  service: NotificationService;
  @Inject()
  authService: AuthService;

  getService(): NotificationService {
    return this.service;
  }

  @Post('/page', { summary: Constants.per.authOnly })
  async page(@Body(ALL) body) {
    body.query = body.query ?? {};
    delete body.query.userId;
    const buildQuery = qb => {
      qb.andWhere('user_id = :userId', { userId: this.getUserId() });
    };
    const res = await this.service.page({
      query: body.query,
      page: body.page,
      sort: body.sort,
      buildQuery,
    });
    return this.ok(res);
  }

  @Post('/list', { summary: Constants.per.authOnly })
  async list(@Body(ALL) body) {
    body.userId = this.getUserId();
    return super.list(body);
  }

  @Post('/add', { summary: Constants.per.authOnly })
  async add(@Body(ALL) bean) {
    bean.userId = this.getUserId();
    return super.add(bean);
  }

  @Post('/update', { summary: Constants.per.authOnly })
  async update(@Body(ALL) bean) {
    await this.service.checkUserId(bean.id, this.getUserId());
    return super.update(bean);
  }
  @Post('/info', { summary: Constants.per.authOnly })
  async info(@Query('id') id: number) {
    await this.service.checkUserId(id, this.getUserId());
    return super.info(id);
  }

  @Post('/delete', { summary: Constants.per.authOnly })
  async delete(@Query('id') id: number) {
    await this.service.checkUserId(id, this.getUserId());
    return super.delete(id);
  }

  @Post('/define', { summary: Constants.per.authOnly })
  async define(@Query('type') type: string) {
    const notification = this.service.getDefineByType(type);
    return this.ok(notification);
  }

  @Post('/getTypeDict', { summary: Constants.per.authOnly })
  async getTypeDict() {
    const list = this.service.getDefineList();
    const dict = [];
    for (const item of list) {
      dict.push({
        value: item.name,
        label: item.title,
      });
    }
    return this.ok(dict);
  }

  @Post('/simpleInfo', { summary: Constants.per.authOnly })
  async simpleInfo(@Query('id') id: number) {
    if (id === 0) {
      //获取默认
      const res = await this.service.getDefault(this.getUserId());
      if (!res) {
        throw new ValidateException('默认通知配置不存在');
      }
      const simple = await this.service.getSimpleInfo(res.id);
      return this.ok(simple);
    }
    await this.authService.checkEntityUserId(this.ctx, this.service, id);
    const res = await this.service.getSimpleInfo(id);
    return this.ok(res);
  }

  @Post('/getDefaultId', { summary: Constants.per.authOnly })
  async getDefaultId() {
    const res = await this.service.getDefault(this.getUserId());
    return this.ok(res?.id);
  }

  @Post('/setDefault', { summary: Constants.per.authOnly })
  async setDefault(@Query('id') id: number) {
    await this.service.checkUserId(id, this.getUserId());
    const res = await this.service.setDefault(id, this.getUserId());
    return this.ok(res);
  }
}
