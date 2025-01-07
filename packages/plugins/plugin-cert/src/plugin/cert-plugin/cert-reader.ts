import { CertInfo } from "./acme.js";
import fs from "fs";
import os from "os";
import path from "path";
import { crypto } from "@certd/acme-client";
import { ILogger } from "@certd/basic";
import dayjs from "dayjs";

export type CertReaderHandleContext = {
  reader: CertReader;
  tmpCrtPath: string;
  tmpKeyPath: string;
  tmpOcPath?: string;
  tmpPfxPath?: string;
  tmpDerPath?: string;
  tmpIcPath?: string;
  tmpJksPath?: string;
  tmpOnePath?: string;
};
export type CertReaderHandle = (ctx: CertReaderHandleContext) => Promise<void>;
export type HandleOpts = { logger: ILogger; handle: CertReaderHandle };
export class CertReader {
  cert: CertInfo;
  oc: string; //仅证书，非fullchain证书
  crt: string;
  key: string;
  csr: string;
  ic: string; //中间证书
  one: string; //crt + key 合成一个pem文件

  detail: any;
  expires: number;
  constructor(certInfo: CertInfo) {
    this.cert = certInfo;
    this.crt = certInfo.crt;
    this.key = certInfo.key;
    this.csr = certInfo.csr;

    this.ic = certInfo.ic;
    if (!this.ic) {
      this.ic = this.getIc();
      this.cert.ic = this.ic;
    }

    this.oc = certInfo.oc;
    if (!this.oc) {
      this.oc = this.getOc();
      this.cert.oc = this.oc;
    }

    this.one = certInfo.one;
    if (!this.one) {
      this.one = this.crt + "\n" + this.key;
      this.cert.one = this.one;
    }

    const { detail, expires } = this.getCrtDetail(this.cert.crt);
    this.detail = detail;
    this.expires = expires.getTime();
  }

  getIc() {
    //中间证书ic， 就是crt的第一个 -----END CERTIFICATE----- 之后的内容
    const endStr = "-----END CERTIFICATE-----";
    const firstBlockEndIndex = this.crt.indexOf(endStr);

    const start = firstBlockEndIndex + endStr.length + 1;
    if (this.crt.length <= start) {
      return "";
    }
    const ic = this.crt.substring(start);
    if (ic == null) {
      return "";
    }
    return ic.trim();
  }

  getOc() {
    //原始证书 就是crt的第一个 -----END CERTIFICATE----- 之前的内容
    const endStr = "-----END CERTIFICATE-----";
    const arr = this.crt.split(endStr);
    return arr[0] + endStr;
  }

  toCertInfo(): CertInfo {
    return this.cert;
  }

  getCrtDetail(crt: string = this.cert.crt) {
    return CertReader.readCertDetail(crt);
  }

  static readCertDetail(crt: string) {
    const detail = crypto.readCertificateInfo(crt.toString());
    const expires = detail.notAfter;
    return { detail, expires };
  }

  getAllDomains() {
    const { detail } = this.getCrtDetail();
    const domains = [detail.domains.commonName];
    domains.push(...detail.domains.altNames);
    return domains;
  }

  saveToFile(type: "crt" | "key" | "pfx" | "der" | "oc" | "one" | "ic" | "jks", filepath?: string) {
    if (!this.cert[type]) {
      return;
    }

    if (filepath == null) {
      //写入临时目录
      filepath = path.join(os.tmpdir(), "/certd/tmp/", Math.floor(Math.random() * 1000000) + `_cert.${type}`);
    }

    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (type === "crt" || type === "key" || type === "ic" || type === "oc" || type === "one") {
      fs.writeFileSync(filepath, this.cert[type]);
    } else {
      fs.writeFileSync(filepath, Buffer.from(this.cert[type], "base64"));
    }
    return filepath;
  }

  async readCertFile(opts: HandleOpts) {
    const logger = opts.logger;
    logger.info("将证书写入本地缓存文件");
    const tmpCrtPath = this.saveToFile("crt");
    const tmpKeyPath = this.saveToFile("key");
    const tmpPfxPath = this.saveToFile("pfx");
    const tmpIcPath = this.saveToFile("ic");
    const tmpOcPath = this.saveToFile("oc");
    const tmpDerPath = this.saveToFile("der");
    const tmpJksPath = this.saveToFile("jks");
    const tmpOnePath = this.saveToFile("one");
    logger.info("本地文件写入成功");
    try {
      return await opts.handle({
        reader: this,
        tmpCrtPath: tmpCrtPath,
        tmpKeyPath: tmpKeyPath,
        tmpPfxPath: tmpPfxPath,
        tmpDerPath: tmpDerPath,
        tmpIcPath: tmpIcPath,
        tmpJksPath: tmpJksPath,
        tmpOcPath: tmpOcPath,
        tmpOnePath,
      });
    } catch (err) {
      logger.error("处理失败", err);
      throw err;
    } finally {
      //删除临时文件
      logger.info("清理临时文件");
      function removeFile(filepath?: string) {
        if (filepath) {
          fs.unlinkSync(filepath);
        }
      }
      removeFile(tmpCrtPath);
      removeFile(tmpKeyPath);
      removeFile(tmpPfxPath);
      removeFile(tmpOcPath);
      removeFile(tmpDerPath);
      removeFile(tmpIcPath);
      removeFile(tmpJksPath);
      removeFile(tmpOnePath);
    }
  }

  buildCertFileName(suffix: string, applyTime: number, prefix = "cert") {
    const detail = this.getCrtDetail();
    let domain = detail.detail.domains.commonName;
    domain = domain.replace(".", "_").replace("*", "_");
    const timeStr = dayjs(applyTime).format("YYYYMMDDHHmmss");
    return `${prefix}_${domain}_${timeStr}.${suffix}`;
  }
}
