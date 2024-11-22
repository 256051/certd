import { PluginRequestHandleReq } from "../plugin";
import { Registrable } from "../registry/index.js";
import { FormItemProps } from "../dt/index.js";
import { HttpClient, ILogger, utils } from "@certd/basic";
import * as _ from "lodash-es";
import { IEmailService } from "../service";

export type NotificationBody = {
  userId: number;
  title: string;
  content: string;
  pipelineId: number;
  historyId: number;
  url: string;
  extra?: any;
  options?: any;
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
export interface INotificationService {
  send(body: NotificationBody): Promise<void>;
}

export interface INotification extends INotificationService {
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
}
