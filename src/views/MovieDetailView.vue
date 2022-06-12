<template>
  <div class="movie-details container">
    <div class="pl-9 tag-line w-full flex flex-row items-center bg-gray-550 rounded-md">
      <div @click="backToHome"
           class="cursor-pointer back-to-home bg-blue-650 text-white flex flex-row items-center justify-center">
        <img src="@/assets/img/back-icon.svg" alt="">
        <span class="ml-2">Back</span>
      </div>
      <div class="flex flex-col ml-16">
        <span class="font-bold text-lg">{{movie?.title}}</span>
        <span class="text-base font-normal">{{movie?.tagline}}</span>
      </div>
    </div>
    <div class="movie-meta-data flex flex-row justify-between mt-20">
      <div class="movie-cover-image w-4/12 rounded-xl overflow-hidden">
        <img class="object-cover object-center w-full h-full"
             :src="getMovieImage(movie?.backdrop_path)"
             alt="guardian">
      </div>
      <div class="movie-meta w-7/12">
        <ul class="mt-7">
          <li class="flex flex-row justify-between">
            <span class="font-bold text-base">Budget</span>
            <span class="font-normal text-base">${{movie?.budget.toLocaleString()}}</span>
          </li>
          <li class="flex flex-row justify-between">
            <span class="font-bold text-base">Revenue</span>
            <span class="font-normal text-base">${{movie?.revenue.toLocaleString()}}</span>
          </li>
          <li class="flex flex-row justify-between">
            <span class="font-bold text-base">Release Date</span>
            <span class="font-normal text-base">{{movie?.release_date}}</span>
          </li>
          <li class="flex flex-row justify-between">
            <span class="font-bold text-base">Runtime</span>
            <span class="font-normal text-base">{{getMovieRunTime(movie?.runtime)}}</span>
          </li>
          <li class="flex flex-row justify-between">
            <span class="font-bold text-base">Score</span>
            <span class="font-normal text-base">
              {{movie?.vote_average}}
            </span>
          </li>
          <li class="flex flex-row justify-between">
            <span class="font-bold text-base">Genres</span>
            <div>
              <span class="font-normal text-base"
                    v-for="(genre, index) in movie?.genres"
                    :key="index">
                {{ (index === (movie?.genres.length - 1)) ? genre?.name : `${genre.name}, `}}
              </span>
            </div>
          </li>
          <li class="flex flex-row justify-between">
            <span class="font-bold text-base">IMDB Link</span>
            <a class="underline text-blue-450" target="_blank" :href="`https://www.imdb.com/title/${movie?.imdb_id}`">
              Link
            </a>
          </li>
          <li class="flex flex-row justify-between">
            <span class="font-bold text-base">Homepage Link</span>
            <a class="underline text-blue-450" target="_blank" :href="movie?.homepage">
              Link
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="movie-description mt-14">
      <p class="font-normal text-base text-black-350">
        {{movie?.overview}}
      </p>
    </div>
    <div class="credits mt-20">
      <span class="font-bold text-lg text-black-350">Credits:</span>
      <p class="text-sm text-black-350 mt-3">

      </p>
      <div>
        <span class="text-sm text-black-350 mt-3"
              v-for="(cast, index) in credits"
              :key="index">
          {{ (index === 9) ? cast?.name : `${cast.name}, `}}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {onMounted, ref} from "vue";
import fetchApi from "@/components/shared/fetchApi";

import type { Ref } from 'vue'
import type { SingleMovie, MovieCast } from "@/types/Movie.model";

type MovieCreditsResponse = {
  cast: MovieCast[];
  crew: MovieCast[];
}

const route = useRoute();
const router = useRouter();
const movie: Ref<SingleMovie | undefined> = ref();
const credits: Ref<MovieCast[] | undefined> = ref();

const getMovieRunTime = (mins: number) => {

  let hours = (mins / 60);
  let rhours = Math.floor(hours);
  let minutes = (hours - rhours) * 60;
  let rminutes = Math.round(minutes);
  return `${rhours}h ${rminutes}m`;
}
/**
 * Get Movie By Id
 * @param movieId
 */
const getMovieById = (movieId: any) => {
  fetchApi.getMethod(`/movie/${movieId}`)
      .then( (response: SingleMovie) => {
        movie.value = response;
      }).catch(err => {
    console.log(err)
  })
}

/**
 * Get movie casts and crews by id
 * @param movieId
 */
const getMovieCredits = (movieId: any) => {
  fetchApi.getMethod(`/movie/${movieId}/credits`)
      .then( (response: MovieCreditsResponse) => {
        const sortByPopularity = response
            .cast
            .sort( (a:MovieCast, b:MovieCast) => b.popularity - a.popularity);

        credits.value = sortByPopularity.splice(0, 10);

      }).catch(err => {
    console.log(err)
  })
}

const backToHome = () => {
  router.back()
}
/**
 * Get movie cover image
 * @param fileName
 */
const getMovieImage = (fileName: string) => {
  return `https://image.tmdb.org/t/p/original${fileName}`
}

onMounted(() => {
  getMovieById(route.params.id);
  getMovieCredits(route.params.id);
})

</script>

<style lang="css" scoped>
  .tag-line {
    min-height: 1px;
    height: 85px;
    margin-top: 69px;
  }
  .back-to-home {
    width: 92px;
    height: 33px;
    border-radius: 100px;
  }
  .back-to-home img {
    width: 13.33px;
    height: 10.76px;
  }
  .movie-meta-data {
    min-height: 495px;
    height: auto;
  }
  .movie-meta-data .movie-cover-image {
    height: 495px;
  }
  .movie-meta ul li {
    margin-top: 16px;
  }
</style>
