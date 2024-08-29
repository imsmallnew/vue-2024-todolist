<script setup>
import { onMounted} from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter();

// 回登入頁
const goPage = () => {
    router.push('/');
}

onMounted(() => {
  console.log("查無此頁, 2秒後導回首頁")
  setTimeout(() =>{
      goPage()
  },2000);    
})
</script>

<template>
  <div id="todoListPage" class="bg-half">
    <div class="conatiner vhContainer" >
      <div class="todoList_Content" style="padding-top: 50px;">
        <div class="todoList_list_empty">          
          <form class="formControls" style="margin-left: 0px;">
            <a href="#"><img class="logoImg" src="https://media.geeksforgeeks.org/wp-content/uploads/20230802153215/Error-404.png" alt="" ></a>            
            <input class="formControls_btnSubmit" type="button" @click="goPage"value="回首頁">
          </form>
        </div>   
     </div>
    </div>
  </div>
</template>

<style>
</style>
