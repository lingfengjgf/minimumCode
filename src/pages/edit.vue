<template>
  <div>
    <div class=" text-center edit-header">header</div>
    <div class=" flex justify-between edit-body">
      <div class="edit-left">
        <tools />
      </div>
      <div class=" flex-1 bg-slate-200">
        <iframe src="/preview" class=" w-full edit-iframe" frameborder="0"></iframe>
      </div>
      <div class="edit-right">right</div>
    </div>
  </div>
</template>

<script setup>
import tools from '../components/edit/tools.vue';
import { previewList } from '../stores/preview';
import { onMounted } from 'vue';
let child = null;
onMounted(() => {
  console.log('edit');
  child = document.querySelector('iframe').contentWindow;
  setTimeout(() => {
    if (child) {
      child.postMessage({ type: 'init',data: null });
    }
  }, 300)

  _EE_.on('create', data => {
    const { components, countComs } = previewList;
    const item = JSON.parse(JSON.stringify(data.componentSchema));
    const { name } = item;
    item.id = Date.now();
    if (countComs[name]) {
      countComs[name] += 1;
    } else {
      countComs[name] = 1;
    }
    components.push(item);
    child.postMessage({ type: 'create',data: item });
  })
});
</script>

<style scoped>
.edit-header {
  box-sizing: border-box;
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #f3f3f3;
}
.edit-body {
  height: calc(100vh - 55px);
}
.edit-left{
  width: 200px;
  display: flex;
  flex-wrap: wrap;
}
.edit-right{
  width: 375px;
}
.edit-iframe{
  height: calc(100vh - 55px);
}

</style>