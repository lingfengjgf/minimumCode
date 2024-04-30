<template>
  <div v-if="data.config.src" class="image">
    {{ data.title }}
  </div>
  <div v-else class="image"> 请上传图片 </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['data'])

</script>

<style scoped>
.image{
  box-sizing: border-box;
  padding: 4px;
  background: #fff;
}
</style>