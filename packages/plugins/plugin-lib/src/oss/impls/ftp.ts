import { BaseOssClient } from "../api.js";
import path from "path";
import os from "os";
import fs from "fs";
import { FtpAccess, FtpClient } from "../../ftp/index.js";

export default class FtpOssClientImpl extends BaseOssClient<FtpAccess> {
  async download(fileName: string, savePath: string) {}
  async listDir(dir: string) {
    return [];
  }
  async upload(filePath: string, fileContent: Buffer) {
    const client = this.getFtpClient();
    await client.connect(async client => {
      const tmpFilePath = path.join(os.tmpdir(), "cert", "http", filePath);
      const dir = path.dirname(tmpFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(tmpFilePath, fileContent);
      try {
        // Write file to temp path
        const path = this.join(this.rootDir, filePath);
        await client.upload(path, tmpFilePath);
      } finally {
        // Remove temp file
        fs.unlinkSync(tmpFilePath);
      }
    });
  }

  private getFtpClient() {
    return new FtpClient({
      access: this.access,
      logger: this.logger,
    });
  }

  async remove(filePath: string) {
    const client = this.getFtpClient();
    await client.connect(async client => {
      const path = this.join(this.rootDir, filePath);
      await client.client.remove(path);
    });
  }
}
