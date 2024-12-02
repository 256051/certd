import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { pluginGroups, pluginRegistry } from '@certd/pipeline';
import { cloneDeep } from 'lodash-es';

@Provide()
@Scope(ScopeEnum.Singleton)
export class BuiltInPluginService {
  getList() {
    const collection = pluginRegistry.storage;
    const list = [];
    for (const key in collection) {
      const Plugin = collection[key];
      if (Plugin?.define?.deprecated) {
        continue;
      }
      list.push({ ...Plugin.define, key });
    }
    return list;
  }

  getGroups() {
    return cloneDeep(pluginGroups);
  }
}
