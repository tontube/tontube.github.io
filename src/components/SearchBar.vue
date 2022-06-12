<template>
  <div class="search-box bg-gray-550 w-full rounded-md flex flex-row-reverse justify-around items-center">
    <button @click="dpSearch" class="search-btn px-3 py-2 bg-blue-650 text-white">Search</button>
    <div class="flex flex-row justify-space-between items-center search-container">
      <span class="mr-2 text-base font-normal">Search by release date:</span>
      <Datepicker v-model="date" range multiCalendars textInput
                  utc
                  @update:modelValue="handleDate"
                  uid="range-date-picker"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'
import Datepicker from '@vuepic/vue-datepicker';

import { ref } from 'vue'

const date = ref();
const emit = defineEmits<{
  (e: 'change', date: any): void
}>();

const handleDate = (modelData: any) => {
  date.value = modelData;
}

const dpSearch = () => {
  emit("change", date.value);
}

</script>

<style scoped>
.search-box {
  margin-top: 69px;
  min-height: 1px;
  height: 85px;
}
.search-box .search-btn {
  border-radius: 100px;
  font-size: 16px;
  font-weight: 400;
}
.dp__main {
  width: 345px;
}
</style>
