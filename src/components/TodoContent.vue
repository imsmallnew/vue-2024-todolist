<template>
    <div class="conatiner todoListPage vhContainerHalf">
      <div class="todoList_Content" >
        <!--認證失敗顯示Start-->
        <div class="todoList_list_empty" v-if="!loginStatus">          
          <form class="formControls" style="margin-left: 0px;padding-top: 30px;">
            <a href="#"><img class="logoImg" src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?t=st=1724662661~exp=1724666261~hmac=a6a692826766b8cdb5b35830e2ae839338351078601c524111877893ea48e371&w=826" alt="" style="width:250px;"></a>
            <h2 class="formControls_txt">請先登入</h2>
            <input class="formControls_btnSubmit" type="button" @click="emit('go-page')" value="登入">
          </form>
        </div>
        <!--認證失敗顯示End-->
        <!--認證成功顯示Start--->
        <div  v-if="loginStatus">
          <!--輸入區Start--->
          <div class="inputBox">
            <input type="text" v-model="editText" value="editText" placeholder="請輸入待辦事項">
            <a href="#" @click.prevent="emit('create-item')" title="新增">
              <i class="fa fa-plus"></i>
            </a>
          </div>
          <!--輸入區End--->          
          <div class="todoList_list">
            <!--頁籤Start--->          
            <ul class="todoList_tab" v-if="todoLists.length > 0">
              <li><a href="#" @click.prevent="emit('change-tab',0)" :class="[selectedTab === 0 ? 'active' : '']">全部({{ todoLists.length }})</a></li>
              <li><a href="#" @click.prevent="emit('change-tab',1)" :class="[selectedTab === 1 ? 'active' : '']">待完成({{ pendingTodos().length}})</a></li>
              <li><a href="#" @click.prevent="emit('change-tab',2)" :class="[selectedTab === 2 ? 'active' : '']">已完成({{ completedTodos().length}})</a></li>
            </ul>
            <!--頁籤End--->
            <!--無待辦事項Start--->  
            <div class="todoList_list_empty" v-if="todoLists.length === 0"><p>目前尚無待辦事項</p></div>
            <!--無待辦事項End--->
            <!--待辦事項Start---> 
            <div class="todoList_items" v-if="todoLists.length > 0">              
              <ul class="todoList_item" v-for="(todo, index) in filterTodos" :key="index"> 
                <li>
                  <label class="todoList_label">
                    <input class="todoList_input" type="checkbox" v-model="todo.status" @click="emit('toggle-todo',todo)">
                    <span>{{ todo.content }}</span>
                  </label>
                  <a href="#" title="編輯"  @click.prevent="XsModal.myModal_show(todo,'E')">
                    <i class="fa fa-edit"></i>
                  </a>
                  <a href="#" title="複製文字" @click.prevent="emit('copy-todo',todo.content)">
                    <i class="fa fa-copy"></i>
                  </a>
                  <a href="#" title="刪除" @click.prevent="XsModal.myModal_show(todo,'D')">
                    <i class="fa fa-times"></i>
                  </a>
                </li>
              </ul>
              <!--進度條Start---> 
              <div v-if="todoLists.length > 0">
                <div class="todoList_statistics">
                  <p> {{ pendingTodos().length}} 個待完成項目, 完成進度 {{percentage()}}</p>
                </div>
                <div class="progress"  >
                  <div class="progress-bar" role="progressbar" :style="{width: percentage()+''}" aria-valuenow="{{ parseInt(precentage())}}" aria-valuemin="0" aria-valuemax="100">{{percentage()}}</div>
                </div>
              </div>
              <!--進度條End---> 
            </div>
            <!--待辦事項End---> 
          </div>
        </div>
      </div>
      <!--認證成功顯示End-->      
    </div>
    <!--刪除更新彈出視窗Start-->
    <AlertModal 
      ref="XsModal"
      :todoLists="todoLists"
      v-model:editText="editText"
      @update-press="updatePress"
      @delete-press="deletePress"
      @toggle-toast="toggleToast"
      @clear-text="emit('clear-text')"
    />
    <!--刪除更新彈出視窗End-->
</template>


<script setup>
import AlertModal from '@/components/AlertModal.vue';
import { defineProps, defineEmits, defineModel, ref} from 'vue';

const emit = defineEmits(['go-page','create-item','change-tab','toggle-todo','copy-todo','clear-text','delete-todo','update-todo','toast-popup']);
const props = defineProps({
    todoLists: Object,
    filterTodos: Object,
    loginStatus: Boolean,
    selectedTab: Number,
});

let editText = defineModel('editText');
const XsModal = ref(null);

// 已完成
const completedTodos = () => {
  return props.todoLists.filter(v=>v.status === true)
}

// 待完成
const pendingTodos = () => {
  return props.todoLists.filter(v=>v.status === false)
}

// 進度條
const percentage = () => {
  return props.todoLists.length === 0 ? "0%" : ((completedTodos().length / props.todoLists.length) * 100).toFixed(0) + "%";
}

// 從XsModal取得修改資訊value再傳回父層
const updatePress = (value) => {
    emit('update-todo',value);
}

const deletePress = (value) => {
    emit('delete-todo',value);
}

const toggleToast = (value) => {
    emit('toast-popup',value);
}

</script>