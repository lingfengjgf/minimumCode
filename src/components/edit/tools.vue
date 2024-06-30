<template>
  <div class="tools">
    <img :src="item.icon" class="tools-icon">
    <span>{{item.title}}</span>
    <span>{{counts[item.name] || 0}}/{{ item.limit }}</span>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { previewList } from "../../stores/preview.js";
import { toolsList } from "../../stores/edit.js"
const props = defineProps(['toolItem']);

const item = props.toolItem;

const counts = reactive(previewList.countComs);

const toolsItemClick = (item) => {
  
  const { countComs } = previewList;
  const { name, limit } = item;
  if (countComs[name] >= limit) {
    return;
  }
  _EE_.emit('create', item);
}
</script>

<style scoped>
.tools{
  width: 80px;
  height: 80px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.tools-icon{
  width: 32;
  height: 32px;
}
</style>