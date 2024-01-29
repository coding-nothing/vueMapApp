<script lang="ts" setup>
import olMapApp from "@/components/olMapApp.vue";
import { ref } from "vue";
const olMapAppRef = ref();
const batchMark = () => {
  olMapAppRef.value && olMapAppRef.value.batchAddRandomMakr();
};
</script>

<template>
  <div class="map-cpnt-container">
    <div class="map-btn">
      <button @click="batchMark">批量打点</button>
    </div>
    <div class="ol-simple-map">
      <olMapApp
        ref="olMapAppRef"
        :useOnlineMap="true"
        :batchAddMarker="true"
      ></olMapApp>
    </div>
  </div>
</template>

<style scoped>
.map-cpnt-container,
.ol-simple-map {
  height: 100%;
  width: 100%;
  position: relative;
}
.map-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1111;
}
</style>
