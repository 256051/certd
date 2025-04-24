export type OssClientDeleteReq = {
  key: string;
  beforeDays?: number;
};

export interface IOssClient {
  upload(key: string, content: Buffer | string): Promise<void>;

  download(key: string, savePath?: string): Promise<void>;

  delete(opts: OssClientDeleteReq): Promise<void>;
}
