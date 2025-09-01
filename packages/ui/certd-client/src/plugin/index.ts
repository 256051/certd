import "./iconify";
import "./iconfont";
import FastCrud from "./fast-crud";
import permission from "./permission";
import { App } from "vue";
import "./validator/index.js";
import directives from "./directive/index";

function install(app: App, options: any = {}) {
  app.use(FastCrud, options);
  app.use(permission);
  app.use(directives);
}

export default {
  install,
};
