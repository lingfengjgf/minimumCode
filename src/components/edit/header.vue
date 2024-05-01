<template>
  <div class="header">
    <span>logo</span>
    <span>画布</span>
    <div class="header-right">
      <span @click="setClick('prev')" class="header-right-btn">撤销</span>
      <span @click="setClick('next')" class="header-right-btn">取消撤销</span>
      <span @click="saveClick" class="header-right-btn">保存</span>
    </div>
  </div>
</template>

<script setup>
const saveClick = () => {
  _EE_.emit('save');
}
const setClick = (type) => {
  _EE_.emit(type);
}
</script>

<style scoped>
.header{
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
}
.header-right-btn{
  padding: 2px 8px;
  border-radius: 4px;
  background: #4399eb;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;
}
.header-right-btn:hover{
  background: #1a86eb;
}
</style>