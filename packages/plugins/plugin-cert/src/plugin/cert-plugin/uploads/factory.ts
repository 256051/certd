export class HttpChallengeUploaderFactory {
  async getClassByType(type: string) {
    if (type === "alioss") {
      return (await import("./impls/alioss.js")).AliossHttpChallengeUploader;
    } else if (type === "ssh") {
      return (await import("./impls/ssh.js")).SshHttpChallengeUploader;
    } else if (type === "ftp") {
      return (await import("./impls/ftp.js")).FtpHttpChallengeUploader;
    } else if (type === "tencentcos") {
      return (await import("./impls/tencentcos.js")).TencentCosHttpChallengeUploader;
    } else if (type === "qiniuoss") {
      return (await import("./impls/qiniuoss.js")).QiniuOssHttpChallengeUploader;
    } else {
      throw new Error(`暂不支持此文件上传方式: ${type}`);
    }
  }
  createUploaderByType(type: string, opts: { rootDir: string; access: any }) {
    const cls = this.getClassByType(type);
    if (cls) {
      // @ts-ignore
      return new cls(opts);
    }
  }
}

export const httpChallengeUploaderFactory = new HttpChallengeUploaderFactory();
