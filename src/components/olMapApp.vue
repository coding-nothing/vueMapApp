<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { HANGZHOU_POINT, HANGZHOU_ADDR, EPSG4326 } from "../config/mapConfig";
import OLMap from "@/hooks/olMap/index";
import Geocoder from "@/hooks/amap/geocoder";
import MarkerLayer from "@/hooks/olMap/marker";
import SelectInteraction from "@/hooks/olMap/select";
import { SelectEvent } from "ol/interaction/Select";
import { Coordinate } from "ol/coordinate";
import { GeoJSON } from "ol/format";

const props = defineProps({
  useOnlineMap: {
    type: Boolean,
    required: true,
  },
  useMarkerPop: {
    type: Boolean,
    default: true,
  },
  autoDrivingRoute: {
    type: Boolean,
    default: true,
  },
  showBorder: {
    type: Boolean,
    default: false,
  },
  batchAddMarker: {
    type: Boolean,
    default: false,
  },
});

// 在线/离线地图
const useOnlineMapRef = computed<Boolean>(() => props.useOnlineMap);
// 坐标信息pop/坐标信息固定左下角
const useMarkerPopRef = computed<Boolean>(() => props.useMarkerPop);
// 地图实例
let map: OLMap;
// 点位图层
let markerLayer: MarkerLayer;
// 地理编码服务
const geocoder = new Geocoder();
// map容器引用
const mapApp = ref(<HTMLElement>{});
// 标记点信息容器引用
const markerInfoApp = ref(<HTMLElement>{});
// 当前标记点坐标 使用ref()是为了阻止该值变化时触发地图刷新重设中心点的行为
let curMarker = ref(HANGZHOU_POINT);
// 当前标记点地址
let curMarkerAddr = ref(HANGZHOU_ADDR);
// 查询地址时展示查询中
let isLoading = ref(false);

const getAddress = (coordinate: Lnglat | Coordinate) => {
  return new Promise((resolve) => {
    geocoder.getAddress(coordinate).then((address) => {
      resolve(address);
    });
  });
};

onMounted(() => {
  map = new OLMap(mapApp.value, useOnlineMapRef.value);
  props.showBorder && map.setBorderView();
  markerLayer = new MarkerLayer();
  const hoverInter = new SelectInteraction([markerLayer.layer]);

  map.addLayer(markerLayer.layer);

  map.addInter(hoverInter.selection);

  map.initMapListener("click", (event: any) => {
    markerLayer.addMarker(event.coordinate);
    isLoading.value = true;
    if (useMarkerPopRef.value) {
      markerInfoApp.value.style.display = "block";
      map.addOverlay(markerInfoApp.value, event.coordinate as Lnglat);
    }
    const coordinate4326 = map.tranfromCoordinate(event.coordinate, EPSG4326);
    getAddress(coordinate4326).then((address) => {
      curMarker.value = event.coordinate;
      curMarkerAddr.value = address as string;
      isLoading.value = false;
    });
  });

  hoverInter.initInteraction((event: SelectEvent) => {
    // 鼠标移入标记
    if (event.selected.length > 0) {
      // 设置鼠标指针为 pointer
      map.setPointer("pointer");
    } else {
      // 鼠标移出
      map.setPointer("default");
    }
  });
});
// 随机生成中心点周围2w个点位
const createCircularPosition = () => {
  const center = HANGZHOU_POINT;
  const circularManyPosition = [];
  for (let i = 0; i < 20000; i++) {
    // 生成随机半径在-20到20之间
    const radius = Math.random() * 40 - 20;
    // 生成随机角度
    const angle = Math.random() * 2 * Math.PI;
    // 计算新点的坐标
    const newX = center[0] + radius * Math.cos(angle);
    const newY = center[1] + radius * Math.sin(angle);
    // 将新点添加到数组
    circularManyPosition.push([newX, newY]);
  }
  return circularManyPosition;
};
const transGeoJson = (pointList: Array<Coordinate>) => {
  const monitorGeoJSON: any = {
    type: "FeatureCollection",
    features: [],
  };
  // 根据positions中的坐标数据，添加到JSON的features数组里面
  for (let i = 0; i < pointList.length; i++) {
    monitorGeoJSON.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: pointList[i],
      },
      properties: {
        name: "监控点",
        description: "这是一个监控点位",
        fromLayerID: "geoJSONLayer",
        custom: {
          id: Math.ceil(Math.random() * 99999),
        },
      },
    });
  }
  return monitorGeoJSON as GeoJSON;
};
// 批量打点 点位聚合到一个图层上
const batchAddRandomMakr = () => {
  const pointList = createCircularPosition();
  markerLayer.batchAddMarker(pointList);
};
const batchAddGeoJsonMarkr = () => {
  const pointList = transGeoJson(createCircularPosition());
  markerLayer.batchAddGeoJsonMarkr(pointList);
};
defineExpose({
  batchAddRandomMakr,
  batchAddGeoJsonMarkr,
});
</script>
<template>
  <div class="map-container">
    <div ref="mapApp" class="map-app"></div>
    <div
      v-if="useMarkerPopRef"
      ref="markerInfoApp"
      style="
        padding: 20px;
        border-radius: 15px;
        background-color: rgba(150, 150, 150, 0.7);
        display: none;
      "
    >
      <div v-if="!isLoading" class="marker-info">
        <span class="lnglat">{{ curMarker }}</span>
        <span class="addr">{{ curMarkerAddr }}</span>
      </div>
      <span v-else>Loading......</span>
    </div>
    <div v-else class="map-corner-box">
      <div v-if="!isLoading">
        <span class="lnglat">{{ curMarker }}</span>
        <span class="addr">{{ curMarkerAddr }}</span>
      </div>
      <span v-else>Loading......</span>
    </div>
  </div>
</template>

<style lang="scss">
.map-container {
  height: 100%;
  width: 100%;

  .map-app {
    height: 100%;
  }
}
.marker-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.map-corner-box {
  position: absolute;
  line-height: 20px;
  height: 20px;
  font-size: 14px;
  bottom: 3px;
  background: rgba(80, 80, 80, 0.7);
  color: white;
}
</style>
