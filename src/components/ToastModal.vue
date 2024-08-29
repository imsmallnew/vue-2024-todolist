<template>
    <div class="toast-container position-fixed top-0 start-0 p-3">    
        <div v-for="(toast, index) in toasts" :key="index" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
            {{ toast.message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps} from 'vue';

const props = defineProps({
  toasts: Object,
});

</script>