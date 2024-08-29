<template>
    <div class="col-6">
        <form class="formControls">
            <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
            <!--信箱欄位-->
            <label class="formControls_label" for="email">Email</label>
            <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" v-model="signInData.email" required>
            <!--信箱錯誤提示-->
            <span>{{ errors.email }}</span>
            <!--密碼欄位-->
            <label class="formControls_label" for="pwd">密碼</label>
            <div style="position: relative;">
                <input class="formControls_input" :type="[eyeOpen ? 'text' : 'password']" name="pwd" id="pwd" placeholder="請輸入密碼" v-model="signInData.password" required>
                <a href="#" class="eye" @click.prevent="emit('show-password')">
                <i :class="[eyeOpen ? showEyeClass : closeEyeClass]"></i>
                </a>
            </div>
            <!--密碼欄位錯誤提示/認證錯誤提示-->
            <span>{{ errors.password }}{{ signInResponse }}</span>
            <!--按鈕區Start-->
            <input class="formControls_btnSubmit" type="button" @click="emit('sign-in')"value="登入">          
            <a class="formControls_btnLink" @click.prevent="emit('go-page','SignUpPage')">註冊帳號</a>
            <!--按鈕區End-->
        </form>
      </div>
</template>
  
<script setup>
import { defineProps, defineEmits, ref} from 'vue';

const emit = defineEmits(['show-password','sign-in','go-page']);
const props = defineProps({
  signInData: Object,
  errors: Object,
  eyeOpen: Boolean,
  signInResponse: String,
});

const showEyeClass = ref('fa-solid fa-eye');
const closeEyeClass = ref('fa-solid fa-eye-slash');

</script>
  