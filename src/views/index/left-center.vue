<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { graphic } from "echarts/core";
import { countUserNum } from "@/api";
import { ElMessage } from "element-plus"
import { useIndexStore } from "@/stores/indexStore";
import { storeToRefs } from 'pinia'

const indexStore = useIndexStore();
const duration = ref(2);

const { userNum } = storeToRefs(indexStore);

let colors = ["#0BFC7F", "#A0A0A0", "#F48C02", "#F4023C"];
const option = ref({});

const echartsGraphic = (colors: string[]) => {
  return new graphic.LinearGradient(1, 0, 0, 0, [
    { offset: 0, color: colors[0] },
    { offset: 1, color: colors[1] },
  ]);
};

watch(userNum,
  () => {
    userNum.value.totalNum = userNum.value.lockNum + userNum.value.offlineNum + userNum.value.onlineNum + userNum.value.alarmNum
    setOption()
  });

const setOption = () => {
  option.value = {
    title: {
      top: "center",
      left: "center",
      text: [`{value|${userNum.value.totalNum}}`, "{name|总数}"].join("\n"),
      textStyle: {
        rich: {
          value: {
            color: "#ffffff",
            fontSize: 24,
            fontWeight: "bold",
            lineHeight: 20,
            padding: [4, 0, 4, 0]
          },
          name: {
            color: "#ffffff",
            lineHeight: 20,
          },
        },
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, .8)",
      textStyle: {
        color: "#FFF",
      },
    },
    series: [
      {
        name: "用户总览",
        type: "pie",
        radius: ["40%", "70%"],
        // avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: "rgba(255,255,255,0)",
          borderWidth: 2,
        },
        color: colors,
        label: {
          show: true,
          formatter: "   {b|{b}}   \n   {c|{c}个}   {per|{d}%}  ",
          //   position: "outside",
          rich: {
            b: {
              color: "#fff",
              fontSize: 12,
              lineHeight: 26,
            },
            c: {
              color: "#31ABE3",
              fontSize: 14,
            },
            per: {
              color: "#31ABE3",
              fontSize: 14,
            },
          },
        },
        emphasis: {
          show: false,
        },
        legend: {
          show: false,
        },
        tooltip: { show: true },

        labelLine: {
          show: true,
          length: 20, // 第一段线 长度
          length2: 36, // 第二段线 长度
          smooth: 0.2,
          lineStyle: {},
        },
        data: [
          {
            value: userNum.value.onlineNum,
            name: "在线",
            itemStyle: {
              color: echartsGraphic(["#0BFC7F", "#A3FDE0"]),
            },
          },
          {
            value: userNum.value.offlineNum,
            name: "离线",
            itemStyle: {
              color: echartsGraphic(["#A0A0A0", "#DBDFDD"]),
            },
          },
          {
            value: userNum.value.lockNum,
            name: "锁定",
            itemStyle: {
              color: echartsGraphic(["#F48C02", "#FDDB7D"]),
            },
          },
          {
            value: userNum.value.alarmNum,
            name: "异常",
            itemStyle: {
              color: echartsGraphic(["#F4023C", "#FB6CB7"]),
            },
          },
        ],
      },
    ],
  };
};
</script>

<template>
  <v-chart class="chart" :option="option" />
</template>

<style scoped lang="scss"></style>
