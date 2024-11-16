import * as envs from "./util.env";
import * as sites from "./util.site";
import * as storages from "./util.storage";
import commons from "./util.common";
import * as mitt from "./util.mitt";
import { routerUtils } from "./util.router";
import { treeUtils } from "./util.tree";
export const util = {
  ...envs,
  ...sites,
  ...storages,
  ...commons,
  ...mitt,
  router: routerUtils,
  tree: treeUtils
};
