import { IFrameView } from "/@/vben/layouts";
import { useSettingStore } from "/@/store/modules/settings";
import { computed } from "vue";
import TutorialButton from "/@/components/tutorial/index.vue";
export const aboutResource = [
  {
    title: "文档",
    name: "document",
    path: "/about/doc",
    component: IFrameView,
    meta: {
      icon: "lucide:book-open-text",
      link: "https://certd.docmirror.cn",
      title: "文档",
      order: 9999,
      show: () => {
        const settingStore = useSettingStore();
        return !settingStore.isComm;
      }
    }
  },
  {
    title: "教程",
    name: "help",
    path: "/help",
    meta: {
      icon: "lucide:copyright",
      order: 9999,
      show: () => {
        const settingStore = useSettingStore();
        return !settingStore.isComm;
      },
      slot() {
        return <TutorialButton className="flex-center" show-icon={false} />;
      },
      click() {}
    }
  }
];

export default aboutResource;
