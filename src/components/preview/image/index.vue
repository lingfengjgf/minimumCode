<template>
  <div v-if="data.config.value" class="image">
    {{ data.title }}
  </div>
  <div v-else class="image none"> 请上传图片 </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['data'])

</script>

<style scoped>
.image{
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  background: #fff;
  text-align: center;
}
.none{
  line-height: 100px;
}
</style>