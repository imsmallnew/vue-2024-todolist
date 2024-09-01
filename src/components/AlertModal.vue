<template>
    <div class="modal" tabindex="-1" ref="modal">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> {{codeType === 'D' ? '是否刪除此待辦清單' : '更新待辦清單內容'}}{{todo.id}}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p v-if="codeType === 'D'">{{todo.content}}</p>
            <input v-if="codeType === 'E'" type="text" v-model.trim="editText" value="editText" placeholder="請輸入待辦事項" style="width:100%">
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="myModal_hide()"
            >
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="onConfirmBtn()">
              {{codeType === 'D' ? '確認刪除' : '確認更新'}}
            </button>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { onMounted, ref, defineEmits, defineModel, defineProps } from 'vue';
import Modal from 'bootstrap/js/dist/modal';

/********* 參數設定 **********/

const props = defineProps({
    todoLists: Object,
});

const modal = ref(null);
const myModal = ref(null);
const todo = ref({});
const emit = defineEmits(['clear-text','delete-press','update-press','toggle-toast']);

let codeType = ref('');
let editText = defineModel('editText');

/********* 功能定義 **********/

onMounted(() => {
  myModal.value = new Modal(modal.value);
});

// 顯示提示popup
const myModal_show = (item,code) => {
  todo.value = item;
  editText.value = item.content;
  codeType.value = code;
  myModal.value.show();
};

// 關閉提示popup
const myModal_hide = () => {
  myModal.value.hide();
  emit('clear-text')
};

// 按下[確認刪除]/[確認更新]
const onConfirmBtn = () =>{
  if(codeType.value === 'D'){
      emit('delete-press',todo.value);
      myModal.value.hide();
  }else{
    // 若更新文字為空白或是長度0無法更新
    if(editText.value.trim() === ''){
      emit('toggle-toast','更新失敗: 待辦事項文字不可為空白');
    }else if(props.todoLists
    // 若更新文字在待辦清單中有重複則無法更新
    .filter(v=>v.id !== todo.value.id)
    .findIndex(v=>v.content === editText.value.trim()) === -1){
      emit('update-press',todo.value);
      myModal.value.hide();
    }else{
      emit('toggle-toast','更新失敗: 已有相同待辦事項,請調整文字');
    }
      
  }
}

defineExpose({
  myModal_show,
  myModal_hide,
});
</script>
  