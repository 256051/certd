import { BaseOssClient, OssClientRemoveByOpts, OssFileItem } from "../api.js";
import path from "node:path";
import { S3Access } from "../../s3/access.js";
export default class S3OssClientImpl extends BaseOssClient<S3Access> {
  client: any;

  async init() {
    // import { S3Client } from "@aws-sdk/client-s3";
    const { S3Client } = await import("@aws-sdk/client-s3");
    this.client = new S3Client({
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.access.accessKeyId, // 默认 MinIO 访问密钥
        secretAccessKey: this.access.secretAccessKey, // 默认 MinIO 秘密密钥
      },
      region: "us-east-1",
      endpoint: this.access.endpoint,
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
    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    const key = path.join(this.rootDir, filePath);
    this.logger.info(`开始上传文件: ${key}`);
    const params = {
      Bucket: this.access.bucket, // The name of the bucket. For example, 'sample_bucket_101'.
      Key: key, // The name of the object. For example, 'sample_upload.txt'.
    };
    await this.client.send(new PutObjectCommand({ Body: fileContent, ...params }));

    this.logger.info(`文件上传成功: ${filePath}`);
  }

  async remove(filePath: string) {
    const key = path.join(this.rootDir, filePath);
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.access.bucket,
        Key: key,
      })
    );

    this.logger.info(`文件删除成功: ${key}`);
  }
}
