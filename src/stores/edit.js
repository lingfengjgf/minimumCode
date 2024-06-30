import { reactive } from "vue";

export const toolsList = reactive([{
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
}]);