<template>
  <div class="index-box">
    <div class="contetn_left">
      <!-- <div class="pagetab">
        <div class="item">实时监测</div>
        <div class="item">统计分析</div>
      </div> -->
      <ItemWrap class="contetn_left-top contetn_lr-item" title="设备总览">
        <LeftTop />
      </ItemWrap>
      <ItemWrap class="contetn_left-center contetn_lr-item" title="用户总览">
        <LeftCenter />
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="设备提醒" style="padding: 0 10px 16px 10px">
        <LeftBottom />
      </ItemWrap>
    </div>
    <div class="contetn_center">
      <CenterMap class="contetn_center_top" title="设备分布图" />
      <ItemWrap class="contetn_center-bottom" title="安装计划">
        <CenterBottom />
      </ItemWrap>
    </div>
    <div class="contetn_right">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="报警次数">
        <RightTop />
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="报警排名(TOP8)" style="padding: 0 10px 16px 10px">
        <RightCenter />
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="数据统计图 ">
        <RightBottom />
      </ItemWrap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import ItemWrap from "@/components/item-wrap";
import LeftTop from "./left-top.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";
import { useIndexStore } from "@/stores/indexStore";
import { storeToRefs } from 'pinia'

const indexStore = useIndexStore();
const {
  deviceNum,
  userNum,
  deviceAlarmList,
  alarmNum,
  alarmRank,
  dataCountView,
  installationPlan,
  centerMapData
} = storeToRefs(indexStore);

const reconnectInterval = ref(null);
// 在组件销毁时清除定时器
onBeforeUnmount(() => clearInterval(reconnectInterval.value));

function connectWebSocket() {
  let ws = new WebSocket('ws://101.201.49.99/ws/channel');

  ws.onopen = function () {
    console.log('Connected to WebSocket server');

    // 发送消息到WebSocket服务器
    const message = JSON.stringify({
      type: 'subscribe',
      channel: 'channel3'
    });
    ws.send(message);
  };

  ws.onmessage = function (event) {

    if (event.data === 'ping') {
      // 如果收到的是心跳消息，则发送一个 pong 消息
      ws.send('pong');
    } else {
      const res = JSON.parse(event.data)
      if (res.data_channel_data_sets_id == 5) {
        deviceNum.value = res.result.result
      }
      if (res.data_channel_data_sets_id == 6) {
        userNum.value = res.result.result
      }
      if (res.data_channel_data_sets_id == 7) {
        deviceAlarmList.value = res.result.result.list
      }
      if (res.data_channel_data_sets_id == 8) {
        alarmNum.value = res.result.result
      }
      if (res.data_channel_data_sets_id == 9) {
        alarmRank.value = res.result.result
      }
      if (res.data_channel_data_sets_id == 10) {
        dataCountView.value = res.result.result
      }
      if (res.data_channel_data_sets_id == 11) {
        installationPlan.value = res.result.result
      }
      if( res.data_channel_data_sets_id == 12){
        centerMapData.value = res.result.result
      }
    }


  };

  ws.onclose = function () {
    console.log('Disconnected from WebSocket server');

    // 重新连接
    reconnect();
  };

  ws.onerror = function (error) {
    console.error('WebSocket error:', error);

    // 重新连接
    reconnect();
  };
}

function reconnect() {
  clearInterval(reconnectInterval.value);

  // 延迟重新连接
  reconnectInterval.value = setInterval(function () {
    connectWebSocket();
  }, 5000);
}



onMounted(() => {
  connectWebSocket();
});
</script>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}

//左边 右边 结构一样
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 540px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.contetn_center {
  flex: 1;
  margin: 0 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .contetn_center-bottom {
    height: 315px;
  }
}

.contetn_lr-item {
  height: 310px;
}
</style>
