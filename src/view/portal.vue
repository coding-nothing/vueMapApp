<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

let activePath = ref('/singlemarkermap')

watchEffect(() => {
  activePath.value = route?.meta.activePath as string || route?.path;
})


</script>
<template>
  <div class="container">
    <div class="menu">
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="activePath"
        router
      >
        <el-menu-item index="/singlemarkermap">
          <el-icon><setting  /></el-icon>
          <span class="menu-label">地图单个标记点</span>
        </el-menu-item>
        <el-menu-item index="/routemap">
          <el-icon><setting  /></el-icon>
          <span class="menu-label">地图轨迹</span>
        </el-menu-item>
        <el-menu-item index="/dragroutemap">
          <el-icon><setting  /></el-icon>
          <span class="menu-label">可拖拽地图轨迹</span>
        </el-menu-item>
        <el-menu-item index="/olsmpmap">
          <el-icon><setting  /></el-icon>
          <span class="menu-label">openlayers 简单地图</span>
        </el-menu-item>
        <el-menu-item index="/olofflinemap">
          <el-icon><setting  /></el-icon>
          <span class="menu-label">openlayers 离线地图：GeoJSON</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main">
        <router-view v-slot="{ Component }">
            <transition name="el-fade-in-linear" mode="out-in">
                <component :is="Component"/>
            </transition>
        </router-view>
    </div>
  </div>
</template>


<style lang="scss" scoped>
/* 在这里添加样式 */
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    .menu {
      max-width: 20vw;
      min-width: 10vw;
      height: 100vh;
    }
    .main {
      flex: 1;
      max-width: 90vw;
      min-width: 80vw;
      height: 100vh;
    }
}
.menu-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>