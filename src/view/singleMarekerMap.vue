<script lang="ts" setup>
import mapApp from '@/components/mapApp.vue';
</script>

<template>
  <div class="single-marker">
    <mapApp :autoDrivingRoute="false"></mapApp>
  </div>
</template>

<style scoped>
.single-marker {
  height: 100%;
  width: 100%;
}</style>