<template>
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <a href="#"><img class="logoImg2" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
      <ul>
        <li class="todo_sm" v-if="loginStatus"><span>歡迎來到 {{user.nickname}} 的待辦清單</span></li>
        <li><a href="#" @click.prevent="emit('sign-out')" v-if="loginStatus">登出</a></li>
      </ul>      
    </nav>
</template>

<script setup>
import { defineProps, defineEmits,} from 'vue';

const emit = defineEmits(['sign-out']);
const props = defineProps({
  user: Object,
  loginStatus: Boolean,
});

</script>