<template>
  <div class="search-box bg-gray-550 w-full rounded-md flex flex-row-reverse justify-around items-center">
    <button class="search-btn px-3 py-2 bg-blue-650 text-white">Search</button>
    <div class="flex flex-row justify-space-between items-center">
      <span class="mr-2 text-base font-normal">Search by release date:</span>
      <Datepicker v-model="date" range multiCalendars textInput
                  @update:modelValue="handleDate"

                  @textSubmit="alertDate"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'
import Datepicker from '@vuepic/vue-datepicker';

import { ref, onMounted } from 'vue'

const date = ref();

const alertDate = () => {
  console.log(date.value);
}

const handleDate = (modelData: any) => {
  emit("change", modelData)
  // do something else with the data
}

const emit = defineEmits<{
  (e: 'change', date: any): void
}>();

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
</style>
