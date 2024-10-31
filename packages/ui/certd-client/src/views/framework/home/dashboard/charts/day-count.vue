<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, defineProps } from "vue";
import { ChartItem } from "/@/views/framework/home/dashboard/charts/d";

use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent]);

provide(THEME_KEY, "");

const props = defineProps<{
  data: ChartItem[];
}>();

const dates = props.data.map((item) => {
  return item.name;
});
const counts = props.data.map((item) => {
  return item.value;
});

var noDataOption = {
  // 使用系统提供的 noData 图形
  graphic: {
    type: "text",
    left: "center",
    top: "center",
    style: {
      text: "无数据",
      textAlign: "center",
      fill: "#ccc"
    }
  }
};

const option = ref({
  noDataSchema: noDataOption,
  color: ["#91cc75", "#73c0de", "#ee6666", "#fac858", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#5470c6"],
  // title: {
  //   text: "",
  //   left: "center"
  // },
  tooltip: {
    trigger: "item"
  },
  // tooltip: {
  //   trigger: "axis",
  //   axisPointer: {
  //     type: "cross",
  //     label: {
  //       backgroundColor: "#6a7985"
  //     }
  //   }
  // },
  // legend: {
  //   data: ["Email",]
  // },
  grid: {
    top: "20px",
    left: "20px",
    right: "20px",
    bottom: "10px",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: dates
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "运行次数",
      type: "line",
      stack: "Total",
      label: {
        show: true,
        position: "top"
      },
      smooth: true,
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: counts
    }
  ]
});
</script>

<style lang="less"></style>
