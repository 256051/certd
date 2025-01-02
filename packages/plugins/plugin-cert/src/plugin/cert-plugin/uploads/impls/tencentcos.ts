import { BaseHttpChallengeUploader } from "../api.js";
import { TencentCosAccess } from "@certd/plugin-lib/dist/tencent/access-cos";

export class TencentCosHttpChallengeUploader extends BaseHttpChallengeUploader<TencentCosAccess> {
  async upload(fileName: string, fileContent: string) {
    return null;
  }

  async remove(fileName: string) {}
}
