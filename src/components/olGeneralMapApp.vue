<script lang="ts" setup>
import OLMap from "@/hooks/olMap/index";
import MarkerLayer from "@/hooks/olMap/marker";
import VectorLayer from "ol/layer/Vector";
// import { Style, Icon } from "ol/style";
import { MarkerList, MarkerIconMap } from "@/data/marker.ts";
// 地图实例
let map: OLMap;
// 点位图层
let devLayer: MarkerLayer;
// 热区图层
let hotArteaLayer: MarkerLayer;
// map容器引用
const mapApp = ref(<HTMLElement>{});

const markerDataList = ref([...MarkerList]);

const handleDrop = (event: any, type: string) => {
  const dragData = {
    ...markerDataList.value.find((item: any) => item.type === type),
    imgUrl: {},
  };
  dragData.imgUrl = MarkerIconMap[dragData.type];
  markerDataList.value = markerDataList.value.filter(
    (item: any) => item.id !== dragData?.id
  );
  event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
};

onMounted(() => {
  map = new OLMap(mapApp.value, false);
  const mapInstance = map.map;

  devLayer = new MarkerLayer("devLayer");
  hotArteaLayer = new MarkerLayer("hotAreaLayer");

  map.addLayer(devLayer.layer as VectorLayer<any>);

  map.initMapListener("click", (event: any) => {
    let selectMap = true;
    const pixel = event.pixel;
    mapInstance.forEachFeatureAtPixel(pixel, (feature: any) => {
      selectMap = false;
      feature.set("selected", true);
    });
    if (selectMap) {
      devLayer.markerList.forEach((marker) => {
        marker.set("selected", false);
      });
    }
    devLayer.markerList.forEach((marker) => {
      devLayer.toggleMarkerIcon(marker);
    });
  });

  mapInstance.getViewport().addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  // 添加放置事件监听器
  mapInstance.getViewport().addEventListener("drop", function (event) {
    event.preventDefault();

    // 获取放置的位置
    const coordinate = mapInstance.getEventCoordinate(event);

    // 获取拖动的图标信息
    const dragData = JSON.parse(
      event?.dataTransfer?.getData("text/plain") as string
    );

    console.log(dragData);

    devLayer.addMarker(coordinate, dragData);
  });
});
</script>
<template>
  <div class="map-container">
    <div ref="mapApp" class="map-app"></div>
    <div class="res-container">
      <i
        class="sample-icon-1"
        draggable="true"
        @dragstart="handleDrop($event, 'type1')"
      ></i>
      <i
        class="sample-icon-2"
        draggable="true"
        @dragstart="handleDrop($event, 'type2')"
      ></i>
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
.res-container {
  position: absolute;
  top: 32px;
  right: 32px;
  width: 80px;
  height: 50px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.sample-icon-1 {
  width: 32px;
  height: 32px;
  background: url("/public/images/marker.svg") top left / cover no-repeat;
}
.sample-icon-2 {
  width: 32px;
  height: 32px;
  background: url("/public/vite.svg") top left / cover no-repeat;
}
</style>
