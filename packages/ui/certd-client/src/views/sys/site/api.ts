// @ts-ignore
import { request } from "/src/api/service";
// 修改为使用 /sys/settings 路由，绕过 commercial-core 的拦截器
const apiPrefix = "/sys/settings";

export async function SettingsGet(key: string) {
  const data = await request({
    url: apiPrefix + "/get",
    method: "post",
    params: { key: "sys.site" },
  });
  // request 函数已经自动解包，返回的是 data 字段的内容
  // 解析 setting 字段，返回实际的站点信息对象
  if (data && data.setting) {
    try {
      const parsed = JSON.parse(data.setting);
      return parsed;
    } catch (e) {
      console.error('解析站点信息失败:', e);
      return {};
    }
  }
  // 如果没有 setting 字段，返回空对象
  return {};
}

export async function SettingsSave(setting: any) {
  await request({
    url: apiPrefix + "/save",
    method: "post",
    data: {
      key: "sys.site",
      title: "站点信息",
      setting: JSON.stringify(setting),
      access: "public",
    },
  });
}
