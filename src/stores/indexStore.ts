import { alarmNum } from '@/api'
import { defineStore } from 'pinia'

export const useIndexStore = defineStore('indexStore', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型
      deviceNum: {
        alarmNum: 0,
        offlineNum: 0,
        onlineNum: 0,
        totalNum: 0,
      },
      userNum: {
        lockNum: 0,
        offlineNum: 0,
        onlineNum: 0,
        alarmNum: 0,
        totalNum: 0,
      },
      deviceAlarmList: [],
      alarmNum: {
        dateList: [],
        numList:[],
        numList2: []
      },
      alarmRank: [],
      dataCountView: [],
      installationPlan: {

      },
      centerMapData: {
        regionCode: [],
        dataList: []
      }
    }
  },
})