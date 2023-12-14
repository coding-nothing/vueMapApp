<script lang="ts" setup>
</script>
<template>
  <div class="pop-container">
    <slot name="markerInfo"></slot>
  </div>
</template>


<style lang="scss" scoped>
/* 在这里添加样式 */
.pop-container {
    background-color: rgb(204 204 204 / 70%);
    padding: 15px;
    border-radius: 15px;
}
</style>