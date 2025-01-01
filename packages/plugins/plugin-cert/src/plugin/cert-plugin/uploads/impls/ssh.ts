import { BaseHttpChallengeUploader } from "../api";
import { SshAccess, SshClient } from "@certd/plugin-lib";
import path from "path";
import os from "os";
import fs from "fs";

export class SshHttpChallengeUploader extends BaseHttpChallengeUploader<SshAccess> {
  async upload(fileName: string, fileContent: string) {
    const tmpFilePath = path.join(os.tmpdir(), "cert", "http", fileName);

    // Write file to temp path
    fs.writeFileSync(tmpFilePath, fileContent);
    try {
      const client = new SshClient(this.logger);
      await client.uploadFiles({
        connectConf: this.access,
        mkdirs: true,
        transports: [
          {
            localPath: fileName,
            remotePath: fileName,
          },
        ],
      });
    } finally {
      // Remove temp file
      fs.unlinkSync(tmpFilePath);
    }
  }

  async remove(filePath: string) {
    const client = new SshClient(this.logger);
    await client.removeFiles({
      connectConf: this.access,
      files: [filePath],
    });
  }
}
