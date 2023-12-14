<script lang="ts" setup>
import mapApp from '@/components/mapApp.vue';
</script>

<template>
  <div class="route">
    <mapApp :autoDrivingRoute="true"></mapApp>
  </div>
</template>

<style scoped>
.route {
  height: 100%;
  width: 100%;
}
</style>