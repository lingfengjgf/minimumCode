<template>
  <div class="image">
    {{ data.title }}
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['data'])

</script>

<style scoped>
.image{
  box-sizing: border-box;
}
</style>