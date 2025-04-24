import { TencentAccess, TencentCosAccess, TencentCosClient } from "../../tencent/index.js";
import { BaseOssClient, OssClientRemoveByOpts, OssFileItem } from "../api.js";

export default class TencentOssClientImpl extends BaseOssClient<TencentCosAccess> {
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
    const access = await this.ctx.accessService.getById<TencentAccess>(this.access.accessId);
    const client = new TencentCosClient({
      access: access,
      logger: this.logger,
      region: this.access.region,
      bucket: this.access.bucket,
    });
    const key = this.rootDir + filePath;
    await client.uploadFile(key, fileContent);
  }

  async remove(filePath: string) {
    const access = await this.ctx.accessService.getById<TencentAccess>(this.access.accessId);
    const client = new TencentCosClient({
      access: access,
      logger: this.logger,
      region: this.access.region,
      bucket: this.access.bucket,
    });
    const key = this.rootDir + filePath;
    await client.removeFile(key);
  }
}
