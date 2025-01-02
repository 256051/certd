import { BaseHttpChallengeUploader } from "../api.js";
import { AliossAccess, AliyunAccess } from "@certd/plugin-lib";
import { AliossClient } from "@certd/plugin-lib";

export class AliossHttpChallengeUploader extends BaseHttpChallengeUploader<AliossAccess> {
  async upload(filePath: string, fileContent: string) {
    const aliyunAccess = await this.ctx.accessService.getById<AliyunAccess>(this.access.accessId);
    const client = new AliossClient({
      access: aliyunAccess,
      bucket: this.access.bucket,
      region: this.access.region,
    });

    await client.uploadFile(filePath, Buffer.from(fileContent));

    this.logger.info(`校验文件上传成功: ${filePath}`);
  }

  async remove(filePath: string) {
    // remove file from alioss
    const client = await this.getAliossClient();
    await client.removeFile(filePath);
    this.logger.info(`文件删除成功: ${filePath}`);
  }

  private async getAliossClient() {
    const aliyunAccess = await this.ctx.accessService.getById<AliyunAccess>(this.access.accessId);
    const client = new AliossClient({
      access: aliyunAccess,
      bucket: this.access.bucket,
      region: this.access.region,
    });
    await client.init();
    return client;
  }
}
