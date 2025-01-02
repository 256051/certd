import { BaseHttpChallengeUploader } from "../api.js";
import { QiniuOssAccess } from "@certd/plugin-lib/dist/qiniu/access-oss";

export class QiniuOssHttpChallengeUploader extends BaseHttpChallengeUploader<QiniuOssAccess> {
  async upload(fileName: string, fileContent: string) {
    return null;
  }

  async remove(fileName: string) {}
}
