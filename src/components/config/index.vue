<template>
  <div class="config">
    <h3 class="config-title">组件配置</h3>
    <component :is="componentInfo.configName" :data="componentInfo" @configChange="configChange"></component>
  </div>
</template>

<script>
import titleTextConfig from './titleTextConfig/index.vue';
import imageConfig from './imageConfig/index.vue';
export default {
  components: {
    titleTextConfig,
    imageConfig
  }
}
</script>

<script setup>
import { defineProps } from 'vue';
const props = defineProps(['componentInfo']);

const configChange = data => {
  _EE_.emit('update', data);
}
</script>

<style scoped>
.config{
  padding: 10px;
}
.config-title{
  margin-bottom: 10px;
  font-weight: bold;
}
</style>