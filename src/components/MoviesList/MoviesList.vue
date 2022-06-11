<template>
  <div class="movies-container">
    <section class="w-full mt-28 flex flex-row flex-wrap justify-between">
        <MovieBox v-for="(movie, index) in movies" :key="index" :movie="movie"
                  :genres="genres"
        ></MovieBox>
    </section>
    <section class="w-full flex flex-row flex-wrap justify-center ">
      <div class="w-full flex justify-center items-center">
        <span class="text-base font-bold text-gray-210 cursor-pointer">Previous Page</span>
        <Divider></Divider>
        <span class="text-base font-bold text-blue-450 cursor-pointer">Next Page</span>
      </div>
      <div class="w-full flex justify-center mt-4">
        <span class="text-base font-normal text-gray-360">Showing results</span>
        <span class="text-base font-normal text-gray-360 ml-1">1-20</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import MovieBox from './components/MovieBox.vue'
import Divider from '../shared/Divider.vue'
import type {MovieModel} from "@/types/Movie.model";
import type {GenresItem} from "@/types/Genres.model";

import {defineProps} from "vue";

type OwnProps = {
  movies: MovieModel[];
  genres: GenresItem[];
}

const { movies, genres } = defineProps<OwnProps>()
</script>

<style scoped lang="css">
</style>
