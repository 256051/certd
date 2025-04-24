import { AccessInput, BaseAccess, IsAccess } from "@certd/pipeline";

/**
 * 这个注解将注册一个授权配置
 * 在certd的后台管理系统中，用户可以选择添加此类型的授权
 */
@IsAccess({
  name: "s3",
  title: "s3/minio授权",
  desc: "S3/minio oss授权",
  icon: "mdi:folder-upload-outline",
})
export class S3Access extends BaseAccess {
  @AccessInput({
    title: "endpoint",
    component: {
      placeholder: "http://xxxxxx:9000",
      name: "a-input",
      vModel: "value",
    },
    helper: "Minio的地址，如果是aws s3 则无需填写",
    required: false,
  })
  endpoint!: string;

  /**
   * const minioClient = new S3Client({
   *   endpoint: "http://localhost:9000",
   *   forcePathStyle: true,
   *   credentials: {
   *     accessKeyId: "minioadmin", // 默认 MinIO 访问密钥
   *     secretAccessKey: "minioadmin", // 默认 MinIO 秘密密钥
   *   },
   *   region: "us-east-1",
   * });
   */

  @AccessInput({
    title: "accessKeyId",
    component: {
      placeholder: "accessKeyId",
    },
    helper: "accessKeyId",
    required: true,
  })
  accessKeyId!: string;

  @AccessInput({
    title: "secretAccessKey",
    component: {
      placeholder: "secretAccessKey",
      component: {
        name: "a-input",
        vModel: "value",
      },
    },
    helper: "secretAccessKey",
    encrypt: true,
    required: true,
  })
  secretAccessKey!: string;

  @AccessInput({
    title: "地区",
    value: "us-east-1",
    component: {
      name: "a-input",
      vModel: "value",
    },
    helper: "region",
    required: true,
  })
  region!: string;

  @AccessInput({
    title: "存储桶",
    component: {
      name: "a-input",
      vModel: "value",
    },
    helper: "bucket 名称",
    required: true,
  })
  bucket!: string;
}

new S3Access();
