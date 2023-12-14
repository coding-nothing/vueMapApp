<script lang="ts" setup>
import olMapApp from '@/components/olMapApp.vue';
</script>

<template>
  <div class="ol-simple-map">
    <olMapApp :useOnlineMap="true"></olMapApp>
  </div>
</template>

<style scoped>
.ol-simple-map {
  height: 100%;
  width: 100%;
}
</style>