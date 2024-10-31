import { ALL, Body, Controller, Inject, Post, Provide } from '@midwayjs/core';
import { BaseController, Constants } from '@certd/lib-server';
import { UserService } from '../../modules/sys/authority/service/user-service.js';
import { RoleService } from '../../modules/sys/authority/service/role-service.js';
import { PipelineService } from '../../modules/pipeline/service/pipeline-service.js';
import { HistoryService } from '../../modules/pipeline/service/history-service.js';

export type ChartItem = {
  name: string;
  value: number;
};
export type UserStatisticCount = {
  pipelineCount?: number;
  pipelineStatusCount?: ChartItem[];
  runningCount: ChartItem[];
  expiringList: any[];
};
/**
 */
@Provide()
@Controller('/api/statistic/')
export class StatisticController extends BaseController {
  @Inject()
  userService: UserService;
  @Inject()
  roleService: RoleService;

  @Inject()
  pipelineService: PipelineService;
  @Inject()
  historyService: HistoryService;

  @Post('/count', { summary: Constants.per.authOnly })
  public async count() {
    const pipelineCount = await this.pipelineService.count({ userId: this.getUserId() });
    let pipelineStatusCount = await this.pipelineService.statusCount({ userId: this.getUserId() });
    pipelineStatusCount = pipelineStatusCount.map(item => {
      return {
        name: item.status,
        value: item.count,
      };
    });

    const historyCount = await this.historyService.dayCount({ userId: this.getUserId(), days: 7 });
    const runningCount = historyCount.map(item => {
      return {
        name: item.date,
        value: item.count,
      };
    });

    const expiringList = await this.pipelineService.latestExpiringList({ userId: this.getUserId(), count: 5 });
    const count: UserStatisticCount = {
      pipelineCount,
      pipelineStatusCount,
      runningCount,
      expiringList,
    };
    return this.ok(count);
  }

  @Post('/changePassword', { summary: Constants.per.authOnly })
  public async changePassword(@Body(ALL) body: any) {
    const userId = this.getUserId();
    await this.userService.changePassword(userId, body);
    return this.ok({});
  }
}
