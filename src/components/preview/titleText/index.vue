<template>
  <div class="titleText" :style="data.styles">
    {{ data.config.value }}
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['data'])

</script>

<style scoped>
.titleText{
  box-sizing: border-box;
  padding: 4px;
  background: #fff;
}
</style>