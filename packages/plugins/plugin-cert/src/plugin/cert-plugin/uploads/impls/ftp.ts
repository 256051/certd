import { BaseHttpChallengeUploader } from "../api";
import { FtpAccess } from "@certd/plugin-lib";
import { FtpClient } from "@certd/plugin-lib/dist/ftp/client";

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
