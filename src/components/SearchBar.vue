<template>
  <div class="search-box bg-gray-550 w-full rounded-md flex flex-row justify-around items-center">
    <button class="search-btn px-3 py-2 bg-blue-650 text-white">Search</button>
    <div>
      <span>Search by release date:</span>
      <date-range-picker
          ref="picker"
          opens="center"
          v-model="dateRange"
          @update="update"
      >
        <template v-slot:input="picker" style="min-width: 350px;">
          {{ dateRange.startDate  }} - {{ dateRange.endDate  }}
        </template>
      </date-range-picker>
      {{dateRange.endDate}}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed} from 'vue'

import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

const startDate = new Date();
const endDate = new Date();
endDate.setDate(endDate.getDate() + 6);

const dateRange = reactive({startDate: '2019-05-01', endDate: '2019-05-15'})



const picker = ref({
  startDate: '', endDate: ''
})
const logEvent = (eventName: string, e:Event) => {
  console.log(e)
}

const linkedCalendars = (q: any) => {
  console.log(q)
}
const date: any = computed(() => {
  new Intl.DateTimeFormat("en-US").format(date)
})

const update = (val: any) => {
  console.log(val)
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
</style>
