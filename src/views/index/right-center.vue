<script setup lang="ts">
import { ref, reactive } from "vue";
import CapsuleChart from "@/components/datav/capsule-chart";
import { ranking } from "@/api";
import { ElMessage } from "element-plus";
import { useIndexStore } from "@/stores/indexStore";
import { storeToRefs } from 'pinia'

const indexStore = useIndexStore();
const { alarmRank } = storeToRefs(indexStore);

const config = ref({
  showValue: true,
  unit: "次",
});

</script>

<template>
  <div class="right_bottom">
    <CapsuleChart :config="config" style="width: 100%; height: 260px" :data="alarmRank" />
  </div>
</template>

<style scoped lang="scss">
.right_bottom {
  box-sizing: border-box;
  padding: 0 16px;
}
</style>
