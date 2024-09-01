<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter';
import {useLoading} from 'vue-loading-overlay';
import LeftSide from '@/components/LeftSide.vue';
import RightInput2Area from '@/components/RightInput2Area.vue';
import ToastModal from '@/components/ToastModal.vue';

/********* 參數設定 **********/

const store = useCounterStore();
const router = useRouter();
const $loading = useLoading({});

let signInResponse = ref('');
let checkoutResponse = ref('');
let loginStatus = ref(false);
const signInStatus = ref(false);

const api = "https://todolist-api.hexschool.io";
const token = ref('');
const eyeOpen = ref(false);
const toasts = ref([]);

const user = ref({
    uid: "",
    nickname: "",
});
const signInData = ref({
    email: store.myEmail || "",
    password: store.myPassword || ""
});
const errors = ref({
    email: "",
    password: "",
});

/********* 功能定義 **********/

// 轉頁
const goPage = (value) => {
    //清除store參數
    store.myEmail = '';
    store.myPassword = '';
    router.push(`/${value}`);
}

// 顯示密碼
const showPassword = ()=>{
  eyeOpen.value =!eyeOpen.value;
}

// 狀態提示
const toastPopup = (message) => {
  toasts.value.push({message: message});
  setTimeout(() => {
    toasts.value.shift()
  }, 3000)
}

// 判斷型別是否為字串
const isString = (value) => {
    return typeof(value) === "string"
}

watch(() => signInData.value.email, (newVal) => {
    if(signInStatus.value && newVal.length === 0){
        // 當有API回應時先不做判斷直到欄位有異動
        return
    }else{
        signInStatus.value === false
    }
   const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (newVal.length === 0) {
        if(signInResponse.value === '帳號密碼驗證錯誤'){return}
        errors.value.email = 'email 欄位未提供';
    } else {
        signInResponse.value = '';
        if (!reg.test(newVal)) {
            errors.value.email = 'email 格式錯誤';
        } else {
            errors.value.email = '';
        }
    }
});

watch(() => signInData.value.password, (newVal) => {
   if(signInData.value.password.length < 6 && signInData.value.password.length !== 0){ 
    errors.value.password = 'password 長度不足6個字';
  }else{
    errors.value.password = "";
  }  
});

// 檢查錯誤訊息
const validateError = ()=>{
    if(errors.value.email.length > 0 || errors.value.password.length > 0){
        toastPopup('有欄位錯誤無法登入');
        return true;
    }
    return false;
}

/********* API 呼叫區 **********/

const signIn = async() => {
    if(validateError()){ return }
    const loader = $loading.show({
        backgroundColor: '#ffffff',
        opacity: 0.9,
    });
    try{
        const response = await axios.post(`${api}/users/sign_in`,
            signInData.value
        );        
        
        // 登入有回應
        signInStatus.value = true;
        signInResponse.value = response.data.token;
        setTimeout(() => {
            loader.hide()
        }, 800)
    
        // 寫入cookie
        document.cookie = `myToken=${response.data.token};  path=/`;
        checkOut();
    } catch(err){
        if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
        }else{
            // 登入有回應
            signInStatus.value = true;
            
            // 清空errors
            errors.value = {
                email: "",
                password: "",
            };
            signInResponse.value = "";  
            setTimeout(() => {
                loader.hide()
            }, 800)
            
            // 錯誤回應填入至指定欄位
            if(isString(err.response.data?.message)){
                signInResponse.value = err.response.data.message;
            }else{
                if(err.response.data.message.filter(d => d.indexOf("email") !== -1)){
                    errors.value.email = err.response.data?.message.filter(d => d.indexOf("email") !== -1).join();
                }
                if(err.response.data.message.filter(d => d.indexOf("password") !== -1)){
                    errors.value.password = err.response.data?.message.filter(d => d.indexOf("password") !== -1).join();
                }
            }    
            // 清空輸入值
            signInData.value = {
                email: "",
                password: "",
            };
        }  
    };
}

const checkOut = async () =>{
    // 讀出 cookie
    token.value = document.cookie.replace(
            /(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/,
            "$1",
    );
    const loader = $loading.show({
        backgroundColor: '#ffffff',
        opacity: 0.9,
    });
    try{
        const response = await axios.get(`${api}/users/checkout`,{
            headers: {
                    Authorization: `${token.value}`,
                }
            }
        );
        checkoutResponse.value = response.data;
        user.value = response.data;
        loginStatus.value = response.data?.status;
        
        setTimeout(() => {
            loader.hide()
        }, 800)

        // 登入成功轉至待辦清單
        if(loginStatus.value){
            goPage('TodoList')
        }        
    } catch(err){
        setTimeout(() => {
            loader.hide()
        }, 800)
        if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
        }else{
            checkoutResponse.value = err.message;
            loginStatus.value = err.status
        }        
    };
}

onMounted(() => {
    token.value = document.cookie.replace(
        /(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
    );
    if(token.value != "") {
      loginStatus.value = true
      checkOut()
    }
})
</script>

<template>
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer row">
      <!--左側LOGO區Start-->
        <LeftSide />
      <!--左側LOGO區End-->
      <!--右側表單區Start-->
        <RightInput2Area 
            :signInData= signInData
            :errors= "errors"
            :eyeOpen= "eyeOpen"
            :signInResponse= "signInResponse"
            @show-password="showPassword"
            @sign-in="signIn"
            @go-page="goPage"
        />
      <!--右側表單區End-->
      <!--提示訊息框Start-->
        <ToastModal :toasts= toasts />
      <!--提示訊息框End-->
    </div>
  </div>
</template>
