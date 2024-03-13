<script lang="ts" setup>
import OLMap from "@/hooks/olMap/index";
import MarkerLayer from "@/hooks/olMap/marker";
import AreaDrawer from "@/hooks/olMap/AreaDrawer";
import VectorLayer from "ol/layer/Vector";
// import { Style, Icon } from "ol/style";
import { MarkerList, MarkerIconMap } from "@/data/marker.ts";
import Feature from "ol/Feature";
import Drag from "@/hooks/olMap/drag";
import { Interaction } from "ol/interaction";
import SelectBox from "@/hooks/olMap/selectBox";
// 地图实例
let map: OLMap;
// 拖动实例
let drag: Drag;
// 框选实例
let selectBox: SelectBox;
// 点位图层
let devLayer: MarkerLayer;
// 热区图层
let hotArteaLayer: MarkerLayer;
// 热区绘制
let hotAreaDrawer: AreaDrawer;
// map容器引用
const mapApp = ref(<HTMLElement>{});

const drawingArea = ref<boolean>(false);

const markerDataList = ref([...MarkerList]);

const handleDrop = (event: any, type: string) => {
  const dragData = {
    ...markerDataList.value.find((item: any) => item.type === type),
    imgUrl: {},
  } as unknown as MarkerData;
  dragData.imgUrl = MarkerIconMap[dragData.type];
  markerDataList.value = markerDataList.value.filter(
    (item: any) => item.id !== dragData?.id
  );
  event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
};
// 开启或关闭热区绘制
const toggleDrawArea = () => {
  drawingArea.value = !drawingArea.value;
  map.switchDrawArea(drawingArea.value, hotAreaDrawer);
};

onMounted(() => {
  map = new OLMap(mapApp.value, false);
  const mapInstance = map.map;

  selectBox = new SelectBox(mapInstance);

  devLayer = new MarkerLayer("devLayer", 111);
  hotArteaLayer = new MarkerLayer("hotAreaLayer", 11);
  hotAreaDrawer = new AreaDrawer(hotArteaLayer.layer);

  map.addLayer(devLayer.layer as VectorLayer<any>);
  map.addLayer(hotArteaLayer.layer as VectorLayer<any>);

  drag = new Drag([devLayer.layer, hotArteaLayer.layer]);
  drag.dragCollection.forEach((inter: Interaction) => {
    mapInstance.addInteraction(inter);
  });

  map.initMapListener("click", (event: any) => {
    let selectMap = true;
    let selectRes = false;
    const pixel = event.pixel;
    const selFeatureList: Feature[] = [];
    const selResFeatureList: Feature[] = [];
    mapInstance.forEachFeatureAtPixel(pixel, (feature: any) => {
      selectMap = false;
      selFeatureList.push(feature);
      if (feature.get("type") !== "type3") {
        selectRes = true;
        selResFeatureList.push(feature);
      }
    });

    if (selectMap) {
      devLayer.markerList.forEach((marker) => {
        marker.set("selected", false);
      });
      hotArteaLayer.markerList.forEach((marker) => {
        marker.set("selected", false);
      });
    } else {
      if (selectRes) {
        selResFeatureList.forEach((feature: Feature) => {
          feature.set("selected", !feature.get("selected"));
        });
      } else {
        selFeatureList.forEach((feature: Feature) => {
          feature.set("selected", !feature.get("selected"));
        });
      }
    }
    devLayer.markerList.forEach((marker) => {
      devLayer.toggleMarkerIcon(marker);
    });
    hotArteaLayer.markerList.forEach((marker) => {
      hotArteaLayer.toggleMarkerStyle(marker);
    });
  });

  mapInstance.getViewport().addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  // 添加放置事件监听器
  mapInstance.getViewport().addEventListener("drop", function (event) {
    event.preventDefault();

    console.log("drop");

    // 获取放置的位置
    const coordinate = mapInstance.getEventCoordinate(event);

    // 获取拖动的图标信息
    const dragData = JSON.parse(
      event?.dataTransfer?.getData("text/plain") as string
    );

    devLayer.addMarker(coordinate, dragData);
  });

  hotAreaDrawer.initDrawListener("drawend", (event: any) => {
    event.feature.set("selected", false);
    event.feature.set("type", "type3");
    event.feature.set("name", "hotArea_1");
    hotArteaLayer.markerList.push(event.feature);
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
    <div class="draw-btn">
      <el-button @click="toggleDrawArea">绘制热区</el-button>
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
.draw-btn {
  position: absolute;
  top: 32px;
  right: 140px;
  width: 80px;
  height: 50px;
}
</style>
