<template>
  <main class="main">
    <section class="container mx-auto">
        <SearchBar @change="handleDateChange"></SearchBar>

        <MoviesList @getMoviesWithPage="handleGetPageMovies"
                    :result="result"
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

const movies: Ref<MovieModel[] | undefined> = ref([]);
const genres: Ref<GenresItem[] | undefined> = ref([]);
const totalPage: Ref<number | undefined> = ref(0);
const result: Ref<MovieResultModel | undefined> = ref({});
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

        result.value = response;
        setTimeout(() => {
          totalPage.value = response.total_pages;
          console.log('================MD==================')
        }, 1000)
        console.log(totalPage)
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
  await getMovies();
  await getAllMovieGenres();
})
</script>
<style lang="css">
.container {
  padding-bottom: 90px;
}
</style>
