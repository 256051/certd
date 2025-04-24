import { QiniuAccess, QiniuClient, QiniuOssAccess } from "../../qiniu/index.js";
import { BaseOssClient, OssClientRemoveByOpts, OssFileItem } from "../api.js";

export default class QiniuOssClientImpl extends BaseOssClient<QiniuOssAccess> {
  client: QiniuClient;
  async init() {
    const qiniuAccess = await this.ctx.accessService.getById<QiniuAccess>(this.access.accessId);
    this.client = new QiniuClient({
      access: qiniuAccess,
      logger: this.logger,
      http: this.ctx.utils.http,
    });
  }

  download(fileName: string, savePath: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeBy(removeByOpts: OssClientRemoveByOpts): Promise<void> {
    throw new Error("Method not implemented.");
  }
  listDir(dir: string): Promise<OssFileItem[]> {
    throw new Error("Method not implemented.");
  }
  async upload(filePath: string, fileContent: Buffer) {
    const path = this.join(this.rootDir, filePath);
    await this.client.uploadFile(this.access.bucket, path, fileContent);
  }

  async remove(filePath: string) {
    const path = this.join(this.rootDir, filePath);
    await this.client.removeFile(this.access.bucket, path);
  }
}
