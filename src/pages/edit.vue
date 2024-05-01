<template>
  <div>
    <div class=" text-center edit-header"><edit-header /></div>
    <div class=" flex justify-between edit-body">
      <div class="edit-left">
        <tools />
      </div>
      <div class=" flex-1 bg-slate-200">
        <iframe src="/preview" class=" w-full edit-iframe" frameborder="0"></iframe>
      </div>
      <div class="edit-right">
        <config :componentInfo="currentComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import EditHeader from '../components/edit/header.vue';
import tools from '../components/edit/tools.vue';
import config from '@config/index.vue';
import { previewList } from '../stores/preview';
import { onMounted, ref } from 'vue';
let child = null;
const currentId = ref('');
const currentComponent = ref({});
let recordId = '';
let latestRecordId = '';

onMounted(() => {
  
  // indexDB
  const req = window.indexedDB.open('minimum-code-record');
  let db;
  req.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore;
    if (!db.objectStoreNames.contains('record')) {
      objectStore = db.createObjectStore('record', { autoIncrement: true });
    }
  }

  req.onsuccess = function (event) {
    db = req.result;
    const objectStore = db.transaction(['record'], 'readwrite').objectStore('record');
    console.log('数据库打开成功');

    const getAllKeys = objectStore.getAllKeys();
    getAllKeys.onsuccess = function (event) {
      latestRecordId = recordId = getAllKeys.result.slice(-1)[0];
      console.log("latestRecordId:",latestRecordId);
      const record = objectStore.get(recordId);
      record.onsuccess = function() {
        console.log("record:",record.result);
        setTimeout(() => {
          _EE_.emit('cover', { key: recordId, value: record.result})
        }, 400)
      };
    };
  };

  const addRecord = async (record) =>  {
    console.log('addRecord:', record);
    if (latestRecordId !== recordId) {
      console.log(`删除${recordId}之后的操作记录`);
      await delRecord(recordId);
    }
    var request = db.transaction(['record'], 'readwrite').objectStore('record').add({ record });

    request.onsuccess = function (event) {
      console.log('数据写入成功:', request.result);
      latestRecordId = recordId = request.result;
    };

    request.onerror = function (event) {
      console.log('数据写入失败');
    }
  }

  // 删除
  const delRecord = (record) => {
    return new Promise((resolve, reject) => {
      const keyRangeValue = IDBKeyRange.lowerBound(record, true);
      const objectStore = db.transaction(['record'], 'readwrite').objectStore('record');
      const openCursor = objectStore.openCursor(keyRangeValue, 'next');

      openCursor.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const delCursor = cursor.delete();
          delCursor.onsuccess = function () {
            console.log("删除成功");
          }
          delCursor.onerror = function () {
            console.log("删除失败");
            reject();
          }
          cursor.continue();
        } else {
          console.log("删除完成");
          resolve();
        }
      };

      openCursor.onerror = function (event) {
        console.log('删除失败');
        reject();
      }
    })
  }

  // 撤销
  const readPrevRecord = () => {
    const keyRangeValue = IDBKeyRange.upperBound(recordId, true);
    const transaction = db.transaction(["record"], "readonly");
    const objectStore = transaction.objectStore("record");

    objectStore.openCursor(keyRangeValue, 'prev').onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        _EE_.emit('cover', cursor)
      } else {
        console.log("没有数据");
      }
    };
  }

  // 取消撤销
  const readNextRecord = () => {
    const keyRangeValue = IDBKeyRange.lowerBound(recordId, true);
    const transaction = db.transaction(["record"], "readonly");
    const objectStore = transaction.objectStore("record");

    objectStore.openCursor(keyRangeValue, 'next').onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        _EE_.emit('cover', cursor)
      } else {
        console.log("没有数据");
      }
    };
  }

  // 清空操作记录，只存储当前记录
  const cleanRecord = () => {
    const objectStore = db.transaction(['record'], 'readwrite').objectStore('record');
    const latestCursor = objectStore.get(recordId);
    let latestRecord;
    latestCursor.onsuccess = function () {
      console.log("latestCursor:",latestCursor.result);
      latestRecord = latestCursor.result.record;
      const clearCursor = objectStore.clear();
      clearCursor.onsuccess = function () {
        console.log('清除记录成功');
        latestRecordId = recordId = '';
        addRecord(latestRecord);
      }
      clearCursor.onerror = function () {
        console.log('清除记录失败');
      }
    }
  }

  child = document.querySelector('iframe').contentWindow;
  setTimeout(() => {
    if (child) {
      child.postMessage({ type: 'init',data: null });
    }
  }, 300)

  window.addEventListener('message', event => {
    const {type, data} = event.data;
    // console.log('子iframe发送的数据：', type, data);
    currentId.value = data;
    const { components } = previewList;
    switch (type) {
      case 'select':
        currentComponent.value = components.find(item => item.id === data);
        break;
    
      default:
        break;
    }
  })

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
    child.postMessage({ type: 'create', data: item });
    addRecord(JSON.stringify(previewList));
  })

  _EE_.on('update', data => {
    const { components } = previewList;
    const { id, type, key, value } = data;
    const index = components.findIndex(comp => comp.id === id);
    if (index > -1) {
      components[index][type][key] = value;
    }
    child.postMessage({ type: 'update', data });
    addRecord(JSON.stringify(previewList));
  })
  _EE_.on('save', () => {
    cleanRecord();
  })
  _EE_.on('prev', () => {
    console.log('prev:');
    readPrevRecord();
  })
  _EE_.on('next', () => {
    console.log('next:');
    readNextRecord();
  })
  _EE_.on('cover', (cursor) => {
    const { value, key } = cursor;
    recordId = key;
    const { countComs, components } = JSON.parse(value.record);
    previewList.countComs = countComs;
    previewList.components = components;
    console.log('cover:', recordId, value);
    currentId.value = '';
    currentComponent.value = {};
    child.postMessage({ type: 'cover', data: { countComs, components } });
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