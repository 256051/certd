import { IsAccess, AccessInput, BaseAccess } from "@certd/pipeline";

@IsAccess({
  name: "ctyun",
  title: "天翼云授权",
  desc: "",
  icon: "ant-design:aliyun-outlined",
})
export class CtyunAccess extends BaseAccess {
  @AccessInput({
    title: "accessKeyId",
    component: {
      placeholder: "accessKeyId",
    },
    helper: "[天翼云AccessKey管理](https://iam.ctyun.cn/myAccessKey)",
    required: true,
  })
  accessKeyId = "";
  @AccessInput({
    title: "securityKey",
    component: {
      placeholder: "securityKey",
    },
    required: true,
    encrypt: true,
    helper: "",
  })
  securityKey = "";
}

new CtyunAccess();
