<template>
  <div @click="toolsItemClick(item)" v-for="(item, i) in toolsList" :key="i" class="tools">
    <img :src="item.icon" class="tools-icon">
    <span>{{item.title}}</span>
    <span>{{counts[item.name] || 0}}/{{ item.limit }}</span>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { previewList } from "../../stores/preview.js";
const toolsList = [{
  title: '标题文本',
  name: 'titleText',
  icon: '/assets/svg/edit-text.svg',
  limit: 50,
  componentSchema: {
    name: 'titleText',
    title: '标题文本',
    styles: {
      fontSize: '14px',
      color: '#333',
      textAlign: 'center'
    },
    configName: 'titleTextConfig',
    config:{
      value: '这是标题文本'
    }
  }
},{
  title: '图片',
  name: 'image',
  icon: '/assets/svg/edit-text.svg',
  limit: 50,
  componentSchema: {
    name: 'image',
    title: '图片',
    configName: 'imageConfig',
    config:{
      value: '',
    }
  }
}]

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