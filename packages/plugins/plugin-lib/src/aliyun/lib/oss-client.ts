import { AliyunAccess } from "../access";

export class AliossClient {
  access: AliyunAccess;

  region: string;
  bucket: string;
  client: any;
  constructor(opts: { access: AliyunAccess; bucket: string; region: string }) {
    this.access = opts.access;
    this.bucket = opts.bucket;
    this.region = opts.region;
  }

  async init() {
    // @ts-ignore
    const OSS = await import("ali-oss");
    this.client = new OSS.default({
      accessKeyId: this.access.accessKeyId,
      accessKeySecret: this.access.accessKeySecret,
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: this.region,
      //@ts-ignore
      authorizationV4: true,
      // yourBucketName填写Bucket名称。
      bucket: this.bucket,
    });
  }

  async doRequest(client: any, bucket: string, xml: string, params: any) {
    params = client._bucketRequestParams("POST", bucket, {
      ...params,
    });
    params.content = xml;
    params.mime = "xml";
    params.successStatuses = [200];
    const res = await client.request(params);
    this.checkRet(res);
    return res;
  }

  checkRet(ret: any) {
    if (ret.code != null) {
      throw new Error("执行失败：" + ret.Message);
    }
  }

  async uploadFile(filePath: string, content: Buffer) {
    const memFile = new File([content], filePath);
    return await this.client.put(filePath, memFile);
  }

  async removeFile(filePath: string) {
    return await this.client.delete(filePath);
  }
}
