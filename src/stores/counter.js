import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const myEmail = ref("");
  const myPassword= ref("");
  const myUid= ref("");
  const signupStatus= ref(false);
  // const count = ref(0)  
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  return {
    myEmail, 
    myPassword,
    myUid,
    signupStatus,
  }
})
