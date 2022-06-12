<template>
  <main class="main">
    <section class="container mx-auto">
        <SearchBar @change="handleDateChange"></SearchBar>

        <MoviesList @getMoviesWithPage="handleGetPageMovies"
                    :total_page="totalPage" :movies="movies" :genres="genres"></MoviesList>
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
const totalPage: Ref<number> = ref(0);

const selectedDate = ref();

type GetMoviesOptions = {
  property: string;
  value: any;
}[];
/**
 * Fetch ALl movies
 */
const getMovies = async (options?: GetMoviesOptions) => {
  fetchApi.getMethod('/discover/movie', {params: {}}, options)
      .then( (response: MovieResultModel) => {
        movies.value = response.results;
        totalPage.value = response.total_pages;
        movies.value.map((item: MovieModel) => {
          item.genres = item.genre_ids.map(genreId => {
            return genres.value.find(item => item.id === genreId)
          })
          debugger
          return item
        })
      }).catch(err => {
          console.log(err)
      })
}
/**
 * Get All Movie Genres
 */
const getAllMovieGenres = async () => {

  fetchApi.getMethod('/genre/movie/list')
      .then( (response: GenresModel) => {
        genres.value = response.genres;
      }).catch(err => {
    console.log(err)
  })
}

/**
 * @param date
 * Handle On search button click
 */
const handleDateChange = (date: any) => {
  let options;

  selectedDate.value = date;
  if (date) {
    const start_date = date[0];
    const end_date = date[1];
    options = [
      {
        property: 'primary_release_date.gte',
        value: start_date,
      } , {
        property: 'primary_release_date.lte',
        value: end_date
      }
    ];
  }

  getMovies(options)
}

/**
 * Get Next Page Movies
 * @param page
 */
const handleGetPageMovies = (page: number) => {

  let options = [
    {
      property: 'page',
      value: page,
    },
  ];
  if (selectedDate.value) {
    const temp = [{
      property: 'primary_release_date.gte',
      value: selectedDate.value[0],
    } , {
      property: 'primary_release_date.lte',
      value: selectedDate.value[1]
    }]
    options = [...options, ...temp];
  }
  getMovies(options);
}
/**
 * On component did mount hook
 */
onMounted(async () =>{
  await getAllMovieGenres();
  await getMovies();

})
</script>
<style lang="css">
.container {
  padding-bottom: 90px;
}
</style>
