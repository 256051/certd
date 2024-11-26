import { PluginRequestHandleReq } from "../plugin";
import { Registrable } from "../registry/index.js";
import { FormItemProps, HistoryResult, Pipeline } from "../dt/index.js";
import { HttpClient, ILogger, utils } from "@certd/basic";
import * as _ from "lodash-es";
import { IEmailService } from "../service/index.js";

export type NotificationBody = {
  userId: number;
  title: string;
  content: string;
  pipeline: Pipeline;
  pipelineId: number;
  result?: HistoryResult;
  historyId: number;
  errorMessage?: string;
  url?: string;
};

export type NotificationRequestHandleReqInput<T = any> = {
  id?: number;
  title?: string;
  access: T;
};

export type NotificationRequestHandleReq<T = any> = PluginRequestHandleReq<NotificationRequestHandleReqInput<T>>;

export type NotificationInputDefine = FormItemProps & {
  title: string;
  required?: boolean;
  encrypt?: boolean;
};
export type NotificationDefine = Registrable & {
  input?: {
    [key: string]: NotificationInputDefine;
  };
};

export type NotificationInstanceConfig = {
  id: number;
  type: string;
  userId: number;
  setting: {
    [key: string]: any;
  };
};

export interface INotificationService {
  getById(id: number): Promise<NotificationInstanceConfig>;
}

export interface INotification {
  ctx: NotificationContext;
  [key: string]: any;
}

export type NotificationContext = {
  http: HttpClient;
  logger: ILogger;
  utils: typeof utils;
  emailService: IEmailService;
};

export abstract class BaseNotification implements INotification {
  ctx!: NotificationContext;
  http!: HttpClient;
  logger!: ILogger;
  abstract send(body: NotificationBody): Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async onInstance() {}
  setCtx(ctx: NotificationContext) {
    this.ctx = ctx;
    this.http = ctx.http;
    this.logger = ctx.logger;
  }

  async onRequest(req: NotificationRequestHandleReq) {
    if (!req.action) {
      throw new Error("action is required");
    }

    let methodName = req.action;
    if (!req.action.startsWith("on")) {
      methodName = `on${_.upperFirst(req.action)}`;
    }

    // @ts-ignore
    const method = this[methodName];
    if (method) {
      // @ts-ignore
      return await this[methodName](req.data);
    }
    throw new Error(`action ${req.action} not found`);
  }

  async onTestRequest() {
    await this.send({
      userId: 0,
      title: "【Certd】测试通知",
      content: "测试通知",
      pipeline: {
        id: 1,
        title: "测试流水线",
      } as any,
      pipelineId: 1,
      historyId: 1,
      url: "https://certd.docmirror.cn",
    });
  }
}
