<template>
  <div class="search-box bg-gray-550 w-full rounded-md flex flex-row justify-around items-center">
    <button class="search-btn px-3 py-2 bg-blue-650 text-white">Search</button>
    <div>
      <span>Search by release date:</span>
      {{count}}
      <date-range-picker
          ref="picker"
          :opens="'center'"
          :locale-data="{ firstDay: 1, format: 'dd-mm-yyyy HH:mm:ss' }"
          :timePicker="timePicker"
          :timePicker24Hour="timePicker24Hour"
          :showWeekNumbers="showWeekNumbers"
          :showDropdowns="showDropdowns"
          :autoApply="autoApply"
          v-model="dateRange"
          @update="updateValues"
          @toggle="logEvent('event: open', $event)"
          @start-selection="logEvent('event: startSelection', $event)"
          @finish-selection="logEvent('event: finishSelection', $event)"
          :linkedCalendars="linkedCalendars"
          :dateFormat="dateFormat"
      >
        <template v-slot:input="picker" style="min-width: 350px;">
          {{ picker.startDate | date }} - {{ picker.endDate | date }}
        </template>
      </date-range-picker>
    </div>
  </div>
</template>

<script setup lang="js">
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

import { defineComponent } from 'vue'
export default defineComponent({
  name: "SearchBar",
  data() {
    return {
      count: 1
    }
  },
  components: { DateRangePicker },
})
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
