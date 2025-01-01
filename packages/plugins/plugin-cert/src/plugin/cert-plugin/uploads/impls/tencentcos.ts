import { BaseHttpChallengeUploader } from "../api";
import { FtpAccess } from "@certd/plugin-lib";

export class TencentCosHttpChallengeUploader extends BaseHttpChallengeUploader<FtpAccess> {
  async upload(fileName: string, fileContent: string) {
    return null;
  }

  async remove(fileName: string) {}
}
