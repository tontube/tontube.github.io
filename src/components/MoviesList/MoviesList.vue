<template>
  <div class="movies-container">
    <section class="w-full mt-28 flex flex-row flex-wrap justify-between">
        <MovieBox v-for="(movie, index) in movies" :key="index" :movie="movie"
                  :genres="genres"
        ></MovieBox>
    </section>
      <Pagination @setPage="handleGetPageMovies" :total="total_page"></Pagination>
  </div>
</template>

<script setup lang="ts">
import MovieBox from './components/MovieBox.vue'

import Pagination from './components/Pagination.vue'
import type {MovieModel} from "@/types/Movie.model";
import type {GenresItem} from "@/types/Genres.model";

import {defineProps} from "vue";

type OwnProps = {
  movies: MovieModel[];
  genres: GenresItem[];
  total_page: number;
}

const emit = defineEmits<{
  (e: 'getMoviesWithPage', page: number): void
}>();

const { movies, genres, total_page } = defineProps<OwnProps>()

const handleGetPageMovies = (page: any) => {
  console.log(page.value)
  emit('getMoviesWithPage', page.value)
}
</script>

<style scoped lang="css">
</style>
