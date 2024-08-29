<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter';
import LeftSide from '@/components/LeftSide.vue';
import RightInput4Area from '@/components/RightInput4Area.vue';
import ToastModal from '@/components/ToastModal.vue';

/********* 參數設定 **********/
const store = useCounterStore();
const router = useRouter();

const api = "https://todolist-api.hexschool.io";
const eyeOpen = ref(false);
const signUpStatus = ref(false);
const toasts = ref([]);

let signUpResponse = ref('');

const signUpData = ref({
    email: "",
    password: "",
    nickname: "",
    password2:""
});

const errors = ref({
    email: "",
    password: "",
    nickname: "",
    password2:""
});

/********* 功能定義 **********/

// 轉頁
const goPage = () => {
    router.push('/');
}

// 顯示密碼
const showPassword = ()=>{
  eyeOpen.value =!eyeOpen.value;
}

// 判斷型別是否為字串
const isString = (value) => {
    return typeof(value) === "string"
}

// 狀態提示
const toastPopup = (message) => {
  toasts.value.push({message: message});
  setTimeout(() => {
    toasts.value.shift()
  }, 3000)
}

// 檢查錯誤訊息
const validateError = ()=>{
    if(errors.value.email.length > 0 || errors.value.nickname.length > 0 || errors.value.password.length > 0 || errors.value.password2.length > 0){
        toastPopup('有欄位錯誤無法註冊');
        return true;
    }
    return false;
}

watch(() => signUpData.value.email, (newVal) => {
  if(signUpStatus.value && newVal.length === 0){
        // 當有API回應時先不做判斷直到欄位有異動
        return
  }else{
        signUpStatus.value === false
  }
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (newVal.length === 0) {
    errors.value.email = 'email 欄位未提供';
  } else {
    if (!reg.test(newVal)) {
        errors.value.email = 'email 格式錯誤';
    } else {
        errors.value.email = '';
    }
  }
});

watch(() => signUpData.value.nickname, (newVal) => {
    if(signUpStatus.value && newVal.length === 0){
        // 當有API回應時先不做判斷直到欄位有異動
        return
    }else{
        signUpStatus.value === false
    }
    if (newVal.length > 0) {
        errors.value.nickname = '';
    } else {
        errors.value.nickname = 'nickname 欄位未提供';
    }
});

watch(() => signUpData.value.password, (newVal) => {
    if(signUpStatus.value && newVal.length === 0){
        // 當有API回應時先不做判斷直到欄位有異動
        return
    }else{
        signUpStatus.value === false
    }
    if(signUpData.value.password.length < 6 && signUpData.value.password.length !== 0){ 
        errors.value.password = 'password 長度不足6個字';
        errors.value.password2 = ''
    if(signUpData.value.password2.length === 0){ return }
    if (newVal === signUpData.value.password2) {
        errors.value.password2 = '';
    } else {
        errors.value.password2 = 'password 不一致';
    }
  }else{
    errors.value.password = "";
    if(signUpData.value.password2.length === 0){ return }
    if (newVal === signUpData.value.password2) {
        errors.value.password2 = '';
    } else {
        errors.value.password2 = 'password 不一致';
    }
  }  
});

watch(() => signUpData.value.password2, (newVal) => {
    if(signUpStatus.value && newVal.length === 0){
        // 當有API回應時先不做判斷直到欄位有異動
        return
    }else{
        signUpStatus.value === false
    }
    if (newVal === signUpData.value.password) {
        errors.value.password2 = '';
    } else {
        errors.value.password2 = 'password 不一致';
    }
});


/********* API 呼叫區 **********/

const signUp = async() => {
    if(validateError()){ return }
    console.log(signUpData.value)
    try{
        const response = await axios.post(`${api}/users/sign_up`,
            signUpData.value
        );     
       
        signUpResponse.value = '註冊成功! 請使用' + signUpData.value.email + '來登入系統';        
        
        // 把user資料寫入store
        store.myEmail = signUpData.value.email + ''
        store.myPassword = signUpData.value.password + ''
        store.myUid = signUpData.value.uid + '' 

        // 註冊有回應
        signUpStatus.value = true;
        
        // 清空輸入值        
        signUpData.value = {
            email: "",
            password: "",
            nickname: "",
            password2: "",
        };

        // 清空錯誤提示
        errors.value = {
            email: "",
            password: "",
            nickname: "",
            password2: "",
        };

        // 跳至登入頁帶入store參數
        setTimeout(() =>{          
            goPage()
        },2000);
    } catch(err){
        if (err.response && err.response.status === 400) {
            console.log('Bad Request: ', err);
        }

        // 註冊有回應
        signUpStatus.value = true;

        // 清空errors
        errors.value = {
            email: "",
            password: "",
            nickname: "",
            password2: "",
        };
        signUpResponse.value = "";

        if(err.code === "ERR_NETWORK"){
            toastPopup("錯誤:" + err.message)  
        }else{
            // 錯誤回應填入至指定欄位
            if(isString(err.response.data?.message)){
                if(err.response.data.message.indexOf("用戶已存在") !== -1){
                    errors.value.email = err.response.data?.message + ": " + signUpData.value.email;
                }else{
                    signUpResponse.value = err.response.data.message;
                }    
            }else{
                if(err.response.data.message.filter(d => d.indexOf("email") !== -1)){
                    errors.value.email = err.response.data?.message.filter(d => d.indexOf("email") !== -1).join();
                }
                if(err.response.data.message.filter(d => d.indexOf("nickname") !== -1)){
                    errors.value.nickname = err.response.data?.message.filter(d => d.indexOf("nickname") !== -1).join();
                }
                if(err.response.data.message.filter(d => d.indexOf("password") !== -1)){
                    errors.value.password = err.response.data?.message.filter(d => d.indexOf("password") !== -1).join();
                }
            }      
            
            // 清空輸入值
            signUpData.value = {
                email: "",
                password: "",
                nickname: "",
                password2: "",
            };
        }
    };
}
</script>

<template>
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer row">
        <!--左側LOGO區Start-->
            <LeftSide />
        <!--左側LOGO區End-->
        <!--右側表單區Start-->
        <RightInput4Area 
            :signUpData= signUpData
            :errors= "errors"
            :eyeOpen= "eyeOpen"
            :signUpResponse= "signUpResponse"
            @show-password="showPassword"
            @sign-up="signUp"
            @go-page="goPage"
        />
        <!--右側表單區End-->
        <!--提示訊息框Start-->
            <ToastModal :toasts= toasts />
        <!--提示訊息框End-->
    </div>
  </div>
</template>

<style>
</style>
