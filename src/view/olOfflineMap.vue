<script lang="ts" setup>
import olMapApp from '@/components/olMapApp.vue';
</script>

<template>
  <div class="ol-offline-map">
    <olMapApp :useOnlineMap="false" :useMarkerPop="false"></olMapApp>
  </div>
</template>

<style scoped>
.ol-offline-map {
  height: 100%;
  width: 100%;
}
</style>