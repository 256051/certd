import { AliyunAccess } from "../aliyun";
import { HttpClient, ILogger } from "@certd/basic";
import { IOssClient, OssClientDeleteReq } from "./api";

export class AliossClient implements IOssClient {
  access: AliyunAccess;
  logger: ILogger;
  http: HttpClient;

  constructor(opts: { access: AliyunAccess; http: HttpClient; logger: ILogger }) {
    this.access = opts.access;
    this.http = opts.http;
    this.logger = opts.logger;
  }

  upload(key: string, content: Buffer | string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  download(key: string, savePath?: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(opts: OssClientDeleteReq): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
