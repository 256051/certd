import { BaseOssClient, OssClientRemoveByOpts, OssFileItem } from "../api.js";
import path from "path";
import os from "os";
import fs from "fs";
import { SftpAccess, SshAccess, SshClient } from "../../ssh/index.js";

export default class SftpOssClientImpl extends BaseOssClient<SftpAccess> {
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
    const tmpFilePath = path.join(os.tmpdir(), "cert", "http", filePath);

    // Write file to temp path
    const dir = path.dirname(tmpFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(tmpFilePath, fileContent);

    const access = await this.ctx.accessService.getById<SshAccess>(this.access.sshAccess);
    const key = this.rootDir + filePath;
    try {
      const client = new SshClient(this.logger);
      await client.uploadFiles({
        connectConf: access,
        mkdirs: true,
        transports: [
          {
            localPath: tmpFilePath,
            remotePath: key,
          },
        ],
        opts: {
          mode: this.access?.fileMode ?? undefined,
        },
      });
    } finally {
      // Remove temp file
      fs.unlinkSync(tmpFilePath);
    }
  }

  async remove(filePath: string) {
    const access = await this.ctx.accessService.getById<SshAccess>(this.access.sshAccess);
    const client = new SshClient(this.logger);
    const key = this.rootDir + filePath;
    await client.removeFiles({
      connectConf: access,
      files: [key],
    });
  }
}
