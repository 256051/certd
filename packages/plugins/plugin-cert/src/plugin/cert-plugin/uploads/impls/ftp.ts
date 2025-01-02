import { BaseHttpChallengeUploader } from "../api.js";
import { FtpAccess, FtpClient } from "@certd/plugin-lib";

export class FtpHttpChallengeUploader extends BaseHttpChallengeUploader<FtpAccess> {
  async upload(fileName: string, fileContent: string) {
    const client = new FtpClient({
      access: this.access,
      logger: this.logger,
    });
    await client.connect(async (client) => {
      await client.upload(fileName, fileContent);
    });
  }

  async remove(fileName: string) {
    const client = new FtpClient({
      access: this.access,
      logger: this.logger,
    });
    await client.connect(async (client) => {
      await client.client.remove(fileName);
    });
  }
}
