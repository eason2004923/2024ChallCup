<template>
  <el-button type="text" icon="el-icon-menu" @click="toggleMenu" class="menu-button"
    ><p>Menu</p></el-button
  >
  <el-popover placement="bottom" width="200" trigger="click" v-model:visible="isMenuVisible">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo dark-mode"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-sub-menu index="1" popper-class="dark-mode">
        <template #title>
          <el-icon><location /></el-icon>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>Navigator Two</template>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <el-icon><document /></el-icon>
        <template #title>Navigator Three</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item>
    </el-menu>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'

const isCollapse = ref(true)
const isMenuVisible = ref(false)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
  min-height: 400px;
  margin: auto;
  padding: auto;
}
.menu-button p {
  font-size: 20px;
}

.menu-button .el-icon {
  margin-right: 5px;
}
.el-popover {
  margin-left: 2rem;
  margin-top: 6rem;
}
</style>
