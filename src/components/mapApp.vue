<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";
// import { ElMessage } from 'element-plus'
import AMapMap from "@/hooks/amap";
import AMapDriving from "@/hooks/amap/driving";
// import Geocoder from "@/hooks/amap/geocoder";

const props = defineProps({
  autoDrivingRoute: {
    // 是否添加轨迹
    type: Boolean,
    default: false,
  },
  dragRoute: {
    // 是否可拖拽
    type: Boolean,
    default: false,
  },
});

// 标记点信息：坐标 地址
const markerInfos = reactive<MarkerInfo[]>(<any>[]);

// 是否支持生成简单轨迹
const enableSmpRoute = computed<boolean>(
  () => props.autoDrivingRoute && markerInfos.length === 2
);
// 是否支持生成可拖拽轨迹
// const enableDragRoute = computed<boolean>(() => props.autoDrivingRoute && props.dragRoute && markerInfos.length === 2)
// 是否删除上一个标记
// const delLstMarkr = computed<boolean>(() => props.autoDrivingRoute ? markerInfos.length === 2 : markerInfos.length === 1)
// 是否可生产轨迹
// const enableRoute = computed<boolean>(() => enableSmpRoute.value || enableDragRoute.value)

// 地理编码服务
// const geocoder = new Geocoder();

// 拖拽
// let drag: any = null

// 根据标记的点规划轨迹
// const setRoute = () => {
//     if (enableRoute.value) {
//         if (enableDragRoute.value) {
//             drag = new AMap.DragRoute(map, markerInfos.map(info => info.lnglat), AMap.DrivingPolicy.LEAST_FEE);
//             drag.search(); //查询导航路径并开启拖拽导航
//         } else if (enableSmpRoute.value) {
//             // 根据起终点经纬度规划驾车导航路线
//             driving.search(markerLnglats[0], markerLnglats[1], function (status: string, result: string) {
//             if (status === 'complete') {
//                 console.log('绘制驾车路线完成')
//                 // ElMessage('绘制驾车路线完成')
//             } else {
//                 console.log('获取驾车数据失败：' + result)
//                 // ElMessage('获取驾车数据失败：' + result)
//             }
//             })
//         }
//     }
// }
// const getAddress = (lnglat: Lnglat) => {
//   return new Promise((resolve) => {
//     geocoder.getAddress(lnglat).then((address) => {
//       resolve(address);
//     });
//   });
// };

const addDrivingRoute = (driving: AMapDriving) => {
  const routePoints = markerInfos.map((markerInfo) => markerInfo.lnglat);
  driving.setRoute(routePoints);
};

const addMarker = (map: AMapMap, lnglat: Lnglat) => {
  markerInfos.shift();
  map.removeMarker();
  map.setMarker(lnglat);
};
onMounted(() => {
  // 地图
  const map: AMapMap = new AMapMap("map-container");
  // 驾车服务
  const driving: AMapDriving = new AMapDriving(map);
  map.initMapListener("click", (e: any) => {
    let lnglat: Lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];
    if (enableSmpRoute.value) {
      addDrivingRoute(driving);
    } else {
      addMarker(map, lnglat);
    }
    // getAddress(lnglat).then((address) => {
    //   markerInfos.push({
    //     lnglat,
    //     addressDscb: `${address}`,
    //   });
    // });
  });
});
</script>
<template>
  <div class="map-app">
    <div class="map-container" id="map-container"></div>
    <div class="map-info-container">
      <div class="location-container">
        <template v-for="item in markerInfos">
          <p>{{ item.lnglat }}</p>
          <p>{{ item.addressDscb }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map-app {
  width: 100%;
  height: 100%;
  display: flex;

  .map-info-container {
    width: 200px;
    height: 100%;
  }

  .map-container {
    flex: 1;
    height: 100%;
  }
}
</style>
<style>
.amap-icon {
  left: -12px;
  top: -24px;
  img {
    left: -4px;
  }
}
</style>
