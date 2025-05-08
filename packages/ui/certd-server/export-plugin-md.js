import "./dist/plugins/index.js";
import { accessRegistry, notificationRegistry, pluginGroups, pluginRegistry } from "@certd/pipeline";
import { dnsProviderRegistry } from "@certd/plugin-cert";
import fs from "fs";

function genPluginMd() {
  const plugins = {
    access: [],
    deploy: [],
    dnsProvider: [],
    notification: []
  };

  plugins.access = accessRegistry.getDefineList();
  plugins.deploy = pluginRegistry.getDefineList();
  plugins.dnsProvider = dnsProviderRegistry.getDefineList();
  plugins.notification = notificationRegistry.getDefineList();


  function genMd(list) {
    let mdContent = `
| 序号 | 名称 | 说明 |
|-----|-----|-----|
`;
    let i = 0;
    for (const x of list) {
      i++
      mdContent += `| ${i}.| **${x.title}** | ${x.desc||''} | \n`;
    }
    return mdContent;
  }

  let mdContent = "";
  mdContent = "# 授权列表\n";
  mdContent += genMd(plugins.access);
  fs.writeFileSync("../../../docs/guide/plugins/access.md", mdContent);

  mdContent = "# DNS提供商\n";
  mdContent += genMd(plugins.dnsProvider);
  fs.writeFileSync("../../../docs/guide/plugins/dns-provider.md", mdContent);


  mdContent = "# 通知插件\n";
  mdContent += genMd(plugins.notification);
  fs.writeFileSync("../../../docs/guide/plugins/notification.md", mdContent);


  mdContent = "# 任务插件\n";
  mdContent += `共 \`${plugins.deploy.length}\` 款任务插件    \n`
  let index =0
  for (const key in pluginGroups) {
    index++
    const group = pluginGroups[key];
    mdContent += `## ${index}. ${group.title}\n`;
    mdContent += genMd(group.plugins);
    fs.writeFileSync("../../../docs/guide/plugins/deploy.md", mdContent);
  }


  process.exit()
}

genPluginMd()
