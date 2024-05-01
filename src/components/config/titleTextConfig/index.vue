<template>
  <div class="config-titleText">
    <div class="config-titleText-title">{{ data.title }}</div>
    <input class="config-titleText-value" type="text" v-model="data.config.value" @input="onChange(data.id, 'config', 'value', data.config.value)">
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['data']);
const emit = defineEmits(['configChange'])

const onChange = (id, type, key, value) => {
  emit('configChange', {id, type, key, value});
}
</script>

<style scoped>
.config-titleText-title{
  margin-bottom: 10px;
}
.config-titleText-value{
  width: 100%;
  border: 1px solid #f1f1f1;
  padding: 2px 5px;
}
</style>