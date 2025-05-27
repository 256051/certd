import { useFormWrapper } from "@fast-crud/fast-crud";
import { useRouter } from "vue-router";

import SiteIpCertMonitor from "./index.vue";

export function useSiteIpMonitor() {
  const { openDialog } = useFormWrapper();
  const router = useRouter();

  async function openSiteIpMonitorDialog(opts: { siteId: number }) {
    await openDialog({
      wrapper: {
        title: "站点IP监控",
        width: "80%",
        is: "a-modal",
        footer: false,
        buttons: {
          cancel: {
            show: false,
          },
          reset: {
            show: false,
          },
          ok: {
            show: false,
          },
        },
        slots: {
          "form-body-top": () => {
            return <SiteIpCertMonitor siteId={opts.siteId} />;
          },
        },
      },
    });
  }

  return {
    openSiteIpMonitorDialog,
  };
}
