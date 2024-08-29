<template>
    <div class="col-6">
          <form class="formControls">
              <!--信箱欄位-->
              <h2 class="formControls_txt">註冊帳號</h2>
              <label class="formControls_label" for="email">Email</label>
              <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" v-model="signUpData.email" required>
              <!--信箱錯誤提示-->
              <span>{{ errors.email }}</span>
              <!--暱稱欄位-->
              <label class="formControls_label" for="name">您的暱稱</label>
              <input class="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" v-model="signUpData.nickname">
              <!--暱稱錯誤提示-->
              <span>{{ errors.nickname }}</span>
              <!--密碼欄位-->
              <label class="formControls_label" for="pwd">密碼</label>
              <div style="position: relative;">
                  <input class="formControls_input" :type="[eyeOpen ? 'text' : 'password']" name="pwd" id="pwd" placeholder="請輸入密碼" v-model="signUpData.password" required>
                  <a href="#" class="eye" @click.prevent="emit('show-password')">
                  <i :class="[eyeOpen ? showEyeClass : closeEyeClass]"></i>
                  </a>
              </div>
              <!--密碼錯誤提示-->
              <span>{{ errors.password }}</span>
              <!--密碼2欄位-->
              <label class="formControls_label" for="pwd">再次輸入密碼</label>
              <div style="position: relative;">
                  <input class="formControls_input" :type="[eyeOpen ? 'text' : 'password']" name="pwd2" id="pwd2" placeholder="請再次輸入密碼" v-model="signUpData.password2" required>
                  <a href="#" class="eye" @click.prevent="emit('show-password')">
                  <i :class="[eyeOpen ? showEyeClass : closeEyeClass]"></i>
                  </a>
              </div>
              <!--密碼2錯誤提示/認證錯誤提示-->
              <span>{{ errors.password2 }}{{ signUpResponse }}</span>
              <!--按鈕區Start-->
              <input class="formControls_btnSubmit" type="button" @click="emit('sign-up')" value="註冊帳號">
              <a class="formControls_btnLink" @click.prevent="emit('go-page')">登入</a>
              <!--按鈕區End-->
          </form>
      </div>
</template>
  
<script setup>
import { defineProps, defineEmits, ref} from 'vue';

const emit = defineEmits(['show-password','sign-up','go-page']);
const props = defineProps({
  signUpData: Object,
  errors: Object,
  eyeOpen: Boolean,
  signUpResponse: String,
});

const showEyeClass = ref('fa-solid fa-eye');
const closeEyeClass = ref('fa-solid fa-eye-slash');

</script>
  