<template>
  <main class="main">
    <section class="container mx-auto">
        <SearchBar @change="handleDateChage"></SearchBar>

        <MoviesList :movies="movies" :genres="genres"></MoviesList>
    </section>
  </main>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import SearchBar from '@/components/SearchBar.vue'
import MoviesList from '@/components/MoviesList/MoviesList.vue'
import fetchApi from "@/components/shared/fetchApi";
import type { Ref } from 'vue'
import type {MovieModel, MovieResultModel} from "@/types/Movie.model";
import type {GenresModel} from "@/types/Genres.model";
import type {GenresItem} from "@/types/Genres.model";

const movies: Ref<MovieModel[]> = ref([]);
const genres: Ref<GenresItem[]> = ref([]);

/**
 * Fetch ALl movies
 */
const getMovies = async (start_date?: string, end_date?: string) => {
  let options = [];
  if (start_date && end_date) {
    options = [
      {
        property: 'release_date.gte',
        value: start_date,
      } , {
        property: 'release_date.lte',
        value: end_date
      }
    ];
  }
  fetchApi.getMethod('/discover/movie', {params: {}}, options)
      .then( (response: MovieResultModel) => {
        movies.value = response.results;
      }).catch(err => {
          console.log(err)
      })
}
const getAllMovieGenres = async () => {

  fetchApi.getMethod('/genre/movie/list')
      .then( (response: GenresModel) => {
        genres.value = response.genres;
        movies.value.map(item => {
          item.genres = item.genre_ids.map(genreId => {
            return genres.value.find(item => item.id === genreId)
          })
          return item
        })
      }).catch(err => {
    console.log(err)
  })
}

const handleDateChage = (date: any) => {
  getMovies(date[0], date[1])
}
/**
 * On component did mount hook
 */
onMounted(async () =>{
  await getMovies();
  await getAllMovieGenres();
})
</script>
<style lang="css">
.container {
  padding-bottom: 90px;
}
</style>
