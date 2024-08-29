<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter';
import {useLoading} from 'vue-loading-overlay';
import ToastModal from '@/components/ToastModal.vue';
import NavInfo from '@/components/NavInfo.vue';
import TodoContent from '@/components/TodoContent.vue';

/********* 參數設定 **********/

const router = useRouter();
const store = useCounterStore();
const $loading = useLoading({});
const loader = $loading.show({
  backgroundColor: '#ffffff',
  opacity: 0.9,
});

let loginStatus = ref(false);
let checkoutResponse = ref('');
let signOutResponse = ref('');
let errorText1 = ref('');

const api = "https://todolist-api.hexschool.io";
const token = ref('');
const selectedTab = ref(0);
const editText = ref('');
const todoLists = ref([])
const toasts = ref([]);
const user = ref({
    uid: "",
    nickname: "",
});

// 按下頁籤顯示指定狀態的項目
const filterTodos = computed(() => {
  if(selectedTab.value === 0){ // All Todos
    return todoLists.value
  }else if(selectedTab.value === 1){ // Pending Todos
    return todoLists.value.filter((v) => v.status === false) 
  }else if(selectedTab.value ===2){ // Done Todos
    return todoLists.value.filter((v) => v.status === true) 
  } 
});

/********* 功能定義 **********/

// 回登入頁
const goPage = () => {
    router.push('/');
}

// 切換頁籤並重新取得todo清單
const changeTab = (value) => {
  selectedTab.value = value;
  getTodoList()
}

// 已完成
const completedTodos = () => {
  return todoLists.value.filter(v=>v.status === true)
}

// 待完成
const pendingTodos = () => {
  return todoLists.value.filter(v=>v.status === false)
}

// 進度條
const percentage = () => {
  return todoLists.value.length === 0 ? "0%" : ((completedTodos().length / todoLists.value.length) * 100).toFixed(0) + "%";
}

// 複製待辦清單文字
const copyTodo = (value) => {
  editText.value = value
}

// 檢查輸入框文字是否重複
const ifDuplicateTodo = (detail) => {
  return todoLists.value.findIndex(v => v.content === detail) !== -1
}

// 檢查輸入框
const validateInput = () => {
  errorText1 = editText.value === "" ? " 新增欄位輸入框不可為空值" : "";
  if( errorText1 !==""){
    return false
  }else{
    return true
  }
}

// 清空輸入框
const clearText = () => {
    editText.value = "";
    errorText1 = ""
}

// 新增代辦清單
const createItem = () => {
  if(!validateInput()){
    toastPopup("有錯誤無法新增:" + errorText1)
    return
  }else{
    createTodo()
  }  
}

// 狀態提示
const toastPopup = (message) => {
  toasts.value.push({message: message});
  setTimeout(() => {
    toasts.value.shift()
  }, 3000)
}

/********* API 呼叫區 **********/

const checkOut = async () =>{
  // 讀出 cookie  
  token.value = document.cookie.replace(
        /(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
    );
    try{
        const response = await axios.get(`${api}/users/checkout`,{
            headers: {
                Authorization: `${token.value}`,
            }
          }
        );
        console.log("token.value:", token.value)
        checkoutResponse.value = response.data;
        user.value = response.data;
        loginStatus.value = response.data?.status        
        if(loginStatus.value){
          console.log(user.value.nickname + " 你已經登入囉")
          getTodoList()
        }else{
          console.log("你還沒登入1!!")                   
        }
        setTimeout(() => {
            loader.hide()
        }, 800)       
    } catch(err){
      setTimeout(() => {
            loader.hide()
      }, 800)
      if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
      }else{
          loginStatus.value = false
      } 
    };
}

onMounted(() => {
    token.value = document.cookie.replace(
        /(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
    );
    if(token.value != "") {
      loginStatus.value = true;
      checkOut()
    }else{
      loader.hide();
      setTimeout(() =>{
          goPage()
      },3000);       
    }
})

const signOut= async() => {
    try{
        const response = await axios.post(`${api}/users/sign_out`,
            {}, //不需要傳參數
            {
                headers: {
                    Authorization: `${token.value}`,
                }
            }
        );        
        signOutResponse.value = response.data.message;
        document.cookie = `myToken=; max-age=0; path=/;`
        console.log("你已登出,歡迎下次光臨!")
        // 自動回首頁
        goPage()
    } catch(err){
      if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
      }else{
          console.log("signOut_err:",err.message)
      }
    };
}
const getTodoList = async() => {
    try{
        const response = await axios.get(`${api}/todos`,{
            headers: {
                Authorization: `${token.value}`,
            }
          }
        );        
        todoLists.value = response.data.data.length > 0 && response.data.data;
        todoLists.value = response.data.data.map(v=>({
               id: v.id,
               createTime: v.createTime,
               content: v.content,
               status: v.status,
               editing: false,
            })
        )
    } catch(err){
      if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
      }else{
          console.log("getTodoList_err:",err.message)
      }
    };
}

const createTodo = async() => {
  let detail = editText.value;  
  //確認事項是否重複
  if(ifDuplicateTodo(detail)){
    toastPopup("已有相同待辦事項,請調整文字")
  }else{
    try{      
        const response = await axios.post(`${api}/todos`,
            {
                "content": detail
            },
            {
                headers: {
                    Authorization: `${token.value}`,
                }
            }           
        );
        let message
        if(response.data.status == true){
          message= `新增待辦事項成功: ${detail}`
          // 因為response的item無提供id, 所以需要call getTodoList() 取得新清單資訊
          clearText();
          getTodoList();
        }else{
          message = '新增待辦事項失敗,請稍後再試'
        }
        toastPopup(message);   
    } catch(err){
        let message = `新增待辦事項失敗, ${err.message}`;
        if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
        }else{
            toastPopup(message);
            console.log("getTodoList_err:",err.message)
        }
    };
  }    
}

const updateTodo = async(item) => {
    let id = item.id
    // 更新用 axios.put
    try{
        const response = await axios.put(`${api}/todos/${id}`,
            {
                "content": editText.value
            },
            {
                headers: {
                    Authorization: `${token.value}`,
                }
            }           
        );
        let message
        if(response.data.status == true){
            message= '更新待辦事項成功';
            const index = todoLists.value.findIndex(i => i.id === item.id);
            todoLists.value[index].content = editText.value;
            clearText();
        }else{
            message = '更新待辦事項失敗,請稍後再試:'+ response.data.message;
        }
        toastPopup(message);
    } catch(err){
        let message = `更新待辦事項失敗, ${err.message}`;
        if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
        }else{
            toastPopup(message);
            console.log("updateTodo_err:",err.message)
        }
    };
}

const deleteTodo = async(item) => {
    let id = item.id
    // 刪除用 axios.delete
    try{
        const response = await axios.delete(`${api}/todos/${id}`,
            {
                headers: {
                    Authorization: `${token.value}`,
                }
            }           
        );
        let message
        if(response.data.status == true){
            message= '刪除待辦事項成功';
            const index = todoLists.value.findIndex(i => i.id === item.id);
            todoLists.value.splice(index, 1);
            clearText()
        }else{
            message= '刪除待辦事項失敗,請稍後再試:'+ response.data.message
        }
        if(pendingTodos().length === 0 && completedTodos().length !== 0){
          message += ", 恭喜你已完成所有待辦事項!";
        } 
        toastPopup(message);    
    } catch(err){
        let message = `刪除待辦事項失敗, ${err.message}`;
        if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
        }else{
            toastPopup(message);
            console.log("deleteTodo_err:",err.message)
        }
    };
}

const toggleTodo = async(item) => {
    let id = item.id
    let message
    // 更新狀態用 axios.patch
    try{
        const response = await axios.patch(`${api}/todos/${id}/toggle`,
            {}, //不需要傳參數    
            {
                headers: {
                    Authorization: `${token.value}`,
                }
            }           
        );        
        if(response.data.status == true){
            message= '待辦事項更新狀態成功';
        }else{
            message= '待辦事項更新狀態失敗,請稍後再試:'+ response.data.message
        }
        getTodoList
        clearText()
        if(pendingTodos().length === 0 && completedTodos().length !== 0){
          message += ", 恭喜你已完成所有待辦事項!";
        } 
        toastPopup(message);
                   
    } catch(err){
        let message = `更新待辦事項失敗, ${err.message}`;
        if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
        }else{
            toastPopup(message);
            console.log("toggleTodo_err:",err.message)
        }
    };
}
</script>

<template>
  <div id="todoListPage" class="bg-half">
    <!--使用者資訊Start-->
      <NavInfo 
        :user="user"
        :loginStatus="loginStatus"
        @sign-out="signOut"
      />
    <!--使用者資訊End-->
    <!--提示訊息框Start-->
      <ToastModal :toasts= toasts />
    <!--提示訊息框End-->
    <!--代辦清單內容區Start-->
      <TodoContent
        :todoLists="todoLists"
        :filterTodos="filterTodos" 
        :loginStatus="loginStatus"
        :selectedTab="selectedTab"
        v-model:editText="editText"
        @go-page="goPage"
        @create-item="createItem"
        @change-tab="changeTab"
        @toggle-todo="toggleTodo"
        @copy-todo="copyTodo"
        @update-todo="updateTodo"
        @delete-todo="deleteTodo"
        @clear-text="clearText"
      />
    <!--代辦清單內容區End-->
  </div>
</template>

<style>
</style>
