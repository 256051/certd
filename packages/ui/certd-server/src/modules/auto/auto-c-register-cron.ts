import { Autoload, Config, Init, Inject, Scope, ScopeEnum } from '@midwayjs/core';
import { PipelineService } from '../pipeline/service/pipeline-service.js';
import { logger } from '@certd/basic';
import { SysSettingsService } from '@certd/lib-server';
import { SiteInfoService } from '../monitor/index.js';
import { Cron } from '../cron/cron.js';
import {UserSettingsService} from "../mine/service/user-settings-service.js";
import {UserSiteMonitorSetting} from "../mine/service/models.js";

@Autoload()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class AutoCRegisterCron {
  @Inject()
  pipelineService: PipelineService;

  @Config('cron.onlyAdminUser')
  private onlyAdminUser: boolean;

  @Config('cron.immediateTriggerOnce')
  private immediateTriggerOnce = false;

  @Config('cron.immediateTriggerSiteMonitor')
  private immediateTriggerSiteMonitor = false;

  @Inject()
  sysSettingsService: SysSettingsService;
  @Inject()
  userSettingsService: UserSettingsService;

  @Inject()
  siteInfoService: SiteInfoService;

  @Inject()
  cron: Cron;

  @Init()
  async init() {
    logger.info('加载定时trigger开始');
    await this.pipelineService.onStartup(this.immediateTriggerOnce, this.onlyAdminUser);
    logger.info('加载定时trigger完成');
    //
    // const meta = getClassMetadata(CLASS_KEY, this.echoPlugin);
    // console.log('meta', meta);
    // const metas = listPropertyDataFromClass(CLASS_KEY, this.echoPlugin);
    // console.log('metas', metas);
    await this.registerSiteMonitorCron();
  }

  async registerSiteMonitorCron() {
    //先注册公共job
    await this.siteInfoService.registerSiteMonitorJob()

    //注册用户独立的检查时间
    const monitorSettingList = await this.userSettingsService.list({
      query:{
        key: UserSiteMonitorSetting.__key__,
      }
    })
    for (const item of monitorSettingList) {
      const setting = item.setting ?? JSON.parse(item.setting)
      if(!setting?.cron){
        continue
      }
      await this.siteInfoService.registerSiteMonitorJob(item.userId)
    }

    if (this.immediateTriggerSiteMonitor) {
      logger.info(`立即触发一次站点证书检查任务`)
      await this.siteInfoService.triggerJobOnce()
    }
  }
}
