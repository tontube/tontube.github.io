<template>
  <section class="w-full mt-28 flex flex-row flex-wrap justify-between">
    <div class="movie-box rounded-md mb-9 flex flex-row bg-gray-350">
      <div class="movie-cover-image">
        <img src="@/assets/img/test-img.svg" alt="" class="object-cover object-center w-full h-full">
      </div>
      <div class="movie-details pl-2.5 flex flex-row flex-wrap content-between py-3">
        <span class="text-base font-bold">Inception</span>
        <div>
          <div class="flex flex-row justify-start">
            <img src="@/assets/img/calendar-icon.svg" alt="calendar-icon">
            <span class="text-xs text-gray-450 pl-2 font-normal">2014-10-22</span>
          </div>
          <div class="tag-lists">
            <ul class="list-disc">
              <li class="text-xs text-gray-450 inline-block font-normal">Action</li>
              <li class="text-xs text-gray-450 inline-block font-normal">Adventure</li>
              <li class="text-xs text-gray-450 inline-block font-normal">Sci-fi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="movie-box">ehsan</div>
    <div class="movie-box">ehsan</div>
    <div class="movie-box">ehsan</div>
    <div class="movie-box">ehsan</div>
    <div class="movie-box">ehsan</div>
    <div class="movie-box">ehsan</div>
    <div class="movie-box">ehsan</div>
  </section>
</template>

<script setup lang="ts">
import CoverPhoto from '@/assets/test-img.svg'
</script>

<style scoped lang="css">
.movie-box {
  padding: 3px 4px;
  border: 1px solid #C4C4C4;
  width: 23%;
  min-height: 1px;
  height: 195px;
}

.movie-cover-image {
  width: 43.38%;
  height: 100%;
}
.movie-cover-image img {
  border-radius: 6px 0 0 6px;
}
.movie-details {
  width: 56.62%;
}
</style>
