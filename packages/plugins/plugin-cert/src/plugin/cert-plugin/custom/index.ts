import { IsTaskPlugin, pluginGroups, RunStrategy, Step, TaskInput } from "@certd/pipeline";
import type { CertInfo } from "../acme.js";
import { CertReader } from "../cert-reader.js";
import { CertApplyBasePlugin } from "../base.js";

export { CertReader };
export type { CertInfo };

@IsTaskPlugin({
  name: "CertUpload",
  icon: "ph:certificate",
  title: "证书手动上传",
  group: pluginGroups.cert.key,
  desc: "在证书仓库手动上传后触发部署证书",
  default: {
    input: {
      renewDays: 35,
      forceUpdate: false,
    },
    strategy: {
      runStrategy: RunStrategy.AlwaysRun,
    },
  },
})
export class CertUploadPlugin extends CertApplyBasePlugin {
  @TaskInput({
    title: "证书仓库ID",
    component: {
      name: "a-cert-select",
      vModel: "value",
    },
    required: true,
  })
  certInfoId!: string;

  async onInstance() {
    this.accessService = this.ctx.accessService;
    this.logger = this.ctx.logger;
    this.userContext = this.ctx.userContext;
    this.lastStatus = this.ctx.lastStatus as Step;
  }
  async onInit(): Promise<void> {}

  async doCertApply() {
    const siteInfoService = this.ctx.serviceContainer["CertInfoService"];

    const certInfo = await siteInfoService.getCertInfo({
      certId: this.certInfoId,
      userid: this.pipeline.userId,
    });

    const certReader = new CertReader(certInfo);
    if (!certReader.expires && certReader.expires < new Date().getTime()) {
      throw new Error("证书已过期，停止部署");
    }

    return certReader;
  }
}

new CertUploadPlugin();
