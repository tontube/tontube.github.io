<template>
  <section class="w-full flex flex-row flex-wrap justify-center ">
    <div class="w-full flex justify-center items-center">
      <span :class="{ 'cursor-not-allowed': (currentPage === 1) }"
            @click="handleGetPreviousPage"
            class="pagination-btn text-base font-bold text-gray-210 cursor-pointer">Previous Page</span>
      <Divider></Divider>
      <span
          @click="handleGetNextPage"
          :class="{ 'cursor-not-allowed': (currentPage === total) }"
          class="pagination-btn text-base font-bold text-blue-450 cursor-pointer">Next Page</span>
    </div>
    <div class="w-full flex justify-center mt-4">
      <span  class="text-base font-normal text-gray-360">Showing results</span>
      <span  class="text-base font-normal text-gray-360 ml-1">{{ currentPage }}-{{result.total_pages}}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import Divider from '@/components/shared/Divider.vue'
import {defineProps, watch} from "vue";
import { ref} from 'vue';

type OwnProps = {
  total: number;
  result: any;
}

const emit = defineEmits<{
  (e: 'setPage', currentPage: any): void
}>();

const currentPage = ref(1);

const { total, result } = defineProps<OwnProps>()

const handleGetPreviousPage = (page: any) => {
  if (currentPage.value !== 1) {
    currentPage.value -= 1;
    emit('setPage', currentPage);
  }

}

const handleGetNextPage = (page: number) => {
  console.log(total)
  console.log(result.total_pages)
  if (currentPage.value < total) {
    currentPage.value += 1;
    emit('setPage', currentPage);
  }
}
</script>

<style scoped>
</style>
