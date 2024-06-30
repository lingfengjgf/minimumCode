<template>
  <div class="preview">
    <div id="previewContainer" @dragenter="onDragenter" @dragleave="onDragleave" class="preview-container">
      <div class="preview-content">
        <div @click="selectItem(item)" v-for="(item, index) in previewList.components" :key="index" class="preview-component-box">
          <component :is='item.name' :data='item' class="preview-component"></component>
          <div v-show="item.id === currentId" class="preview-component-border"></div>
          <span class="preview-component-tip" :class="{'active': item.id === currentId}">{{item.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleText from '@preview/titleText/index.vue';
import Image from '@preview/image/index.vue';
export default {
  components: {
    TitleText,
    Image
  }
}
</script>

<script setup>
import { onMounted, ref } from 'vue';
import { previewList } from '../stores/preview';

let parent = null;
const currentId = ref('');

const selectItem = (item) => {
  currentId.value = item.id;
  parent.postMessage({
    type: 'select',
    data: item.id
  });
}

let previewContainer = null;
let previewWidth;
let previewHeight;
let isDragging = false;
const draggingCounter = ref(0);

const onDragenter = (event) => {
  if (draggingCounter.value === 0) {
    console.log("拖拽进入...");
    isDragging = true;
  }
  draggingCounter.value++;
};

const onDragleave = (event) => {
  draggingCounter.value--;
  if (draggingCounter.value === 0) {
    console.log("拖拽离开...");
    isDragging = false;
  }
};

onMounted(() => {
  previewContainer = document.getElementById('previewContainer');
  const previewX = previewContainer.getBoundingClientRect().x;
  previewWidth = previewContainer.offsetWidth;
  previewHeight = previewContainer.offsetHeight;
  window.addEventListener('message', (event) => {
    const { data, source } = event;
    const { components } = previewList;
    // console.log('child message:',data, source);
    if (data.type === 'init') {
      parent = source;
    }
    if (data.type === 'create') {
      components.push(data.data);
    }
    if (data.type === 'update') {
      // console.log("iframe update:",data.data);
      const { id, type, key, value } = data.data;
      const index = components.findIndex(comp => comp.id === id);
      if (index > -1) {
        components[index][type][key] = value;
      }
    }
    if (data.type === 'cover') {
      const { countComs, components } = data.data;
      previewList.countComs = countComs;
      previewList.components = components;
      currentId.value = '';
    }
    if (data.type === 'drag') {
      // 拖拽添加组件
      const {dragX, dragY} = data.data;
      // const {x, y} = getPosition(dragX, dragY);
      const x = dragX - previewX - 10;
      const y = dragY - 20;
      // console.log('drag:',x,y,dragX, dragY);
      parentDragging(x, y);
    }

  });
});

const parentDragging = (x, y) => {
  if (isDragging && x > 0 && x < previewWidth && y > 0 && y < previewHeight) {
    console.log('parentDragging:',x,y);
  }
}

// const getPosition = (dragX, dragY) => {
//   const x = dragX - 10;
//   const y = dragY - 10;
//   return {x, y};
// }
</script>

<style scope>
.preview{
  padding: 10px;
  box-sizing: border-box;
}
.preview-container{
  width: 375px;
  height: calc(100vh - 75px);
  background: #fff;
  margin: 0 auto;
}
.preview-component{
  position: relative;
  z-index: 1;
}
.preview-component-box{
  position: relative;
  margin-bottom: 2px;
}
.preview-component-border{
  position: absolute;
  background: #4399eb;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  top: -2px;
  left: -2px;
}
.preview-component-tip{
  position: absolute;
  top: 50%;
  left: -10px;
  transform: translate(-100%, -50%);
  border: 1px solid #999;
  padding: 0 5px;
  background: #fff;
  cursor: move;
}
.preview-component-tip::before{
  content: ' ';
  position: absolute;
  top: 50%;
  right: -7px;
  transform: translateY(-50%);
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 7px solid #999;
}
.preview-component-tip::after{
  content: ' ';
  position: absolute;
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid #fff;
  z-index: 1;
}

.preview-component-tip.active{
  background: #4399eb;
  color: #fff;
  border-color: #4399eb;
}
.preview-component-tip.active::before{
  border-left: 7px solid #4399eb;
}
.preview-component-tip.active::after{
  border-left: 6px solid #4399eb;
}
/* 自定义整个滚动条 */
::-webkit-scrollbar {
  width: 2px; /* 滚动条宽度 */
}
 
/* 自定义滚动条轨道 */
::-webkit-scrollbar-track {
  background: #f1f1f1; /* 轨道颜色 */
}
 
/* 自定义滚动条的滑块（thumb） */
::-webkit-scrollbar-thumb {
  background: #ccc; /* 滑块颜色 */
}
 
/* 当hover或active状态时，自定义滑块的颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>