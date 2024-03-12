<script lang="ts" setup>
import OLMap from "@/hooks/olMap/index";
import MarkerLayer from "@/hooks/olMap/marker";
import VectorLayer from "ol/layer/Vector";
import { Style, Icon } from "ol/style";

// 地图实例
let map: OLMap;
// 点位图层
let devLayer: MarkerLayer;
// 热区图层
let hotArteaLayer: MarkerLayer;
// map容器引用
const mapApp = ref(<HTMLElement>{});

const point = [120.20916198835458, 30.312617010742187] as Lnglat;

onMounted(() => {
  map = new OLMap(mapApp.value, false);
  devLayer = new MarkerLayer("devLayer");
  hotArteaLayer = new MarkerLayer("hotAreaLayer");

  map.addLayer(devLayer.layer as VectorLayer<any>);

  devLayer.addMarker(point, "dev_112233", "/public/vite.svg");

  map.initMapListener("click", (event: any) => {
    map.map.forEachFeatureAtPixel(event.pixel, (feature: Feature) => {
      console.log(feature.get("markerID"));
      feature.setStyle(
        new Style({
          image: new Icon({
            src: "/public/sel-vite.svg",
          }),
        })
      );
    });
  });
});
</script>
<template>
  <div class="map-container">
    <div ref="mapApp" class="map-app"></div>
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
