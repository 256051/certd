import { request } from "../service";

export type SiteEnv = {
  agent?: {
    enabled?: boolean;
    contactText?: string;
    contactLink?: string;
  };
};
export type SiteInfo = {
  title?: string;
  slogan?: string;
  logo?: string;
  loginLogo?: string;
  icpNo?: string;
  licenseTo?: string;
  licenseToUrl?: string;
};

export type PlusInfo = {
  vipType?: string;
  expireTime?: number;
  isPlus: boolean;
  isComm?: boolean;
};
export type SysPublicSetting = {
  registerEnabled?: boolean;
  limitUserPipelineCount?: number;
  managerOtherUserPipeline?: boolean;
  icpNo?: string;
};

export type SysPrivateSetting = {
  httpProxy?: string;
  httpsProxy?: string;
  dnsResultOrder?: string;
  commonCnameEnabled?: boolean;
};
export type SysInstallInfo = {
  siteId: string;
};
export type MenuItem = {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
};
export type HeaderMenus = {
  menus: MenuItem[];
};

export type AllSettings = {
  sysPublic: SysPublicSetting;
  installInfo: SysInstallInfo;
  plusInfo: PlusInfo;
  siteInfo: SiteInfo;
  siteEnv: SiteEnv;
  headerMenus: HeaderMenus;
};

export async function loadAllSettings(): Promise<AllSettings> {
  return await request({
    url: "/basic/settings/all",
    method: "get"
  });
}

export async function bindUrl(data: any): Promise<any> {
  return await request({
    url: "/sys/plus/bindUrl",
    method: "post",
    data
  });
}
