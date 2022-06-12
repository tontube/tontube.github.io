<template>
  <div class="movie-box rounded-md mb-9 flex flex-row bg-gray-350 cursor-pointer"
       @click="goToMovieDetails(movie.id)">
    <div class="movie-cover-image">
      <img :src="getMovieImage(movie.poster_path)" alt="" class="object-cover object-center w-full h-full">
    </div>
    <div class="movie-details pl-2.5 flex flex-row flex-wrap content-between py-3">
      <span class="truncate-text text-base font-bold">{{movie.title}}</span>
      <div>
        <div class="flex flex-row justify-start">
          <img src="@/assets/img/calendar-icon.svg" alt="calendar-icon">
          <span class="text-xs text-gray-450 pl-2 font-normal">{{movie.release_date}}</span>
        </div>
        <div class="tag-lists mt-2">
          <ul>
            <li v-for="(genre, index) in movie.genres"
                :key="index"
                class="text-xs inline-block text-gray-450  font-normal">{{genre.name}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {MovieModel} from "@/types/Movie.model";
import type {GenresItem} from "@/types/Genres.model";
import { useRouter } from 'vue-router';

type OwnProps = {
  movie: MovieModel;
  genres: GenresItem[];
}

const router = useRouter()

const { movie, genres } = defineProps<OwnProps>()
/**
 * Go to movie detail page
 * @param movieId
 */
const goToMovieDetails = (movieId: number) => {
  router.push(`/movie/${movieId}/details`)
}
/**
 * Get movie cover image
 * @param fileName
 */
const getMovieImage = (fileName: string) => {
  return `https://image.tmdb.org/t/p/original${fileName}`
}
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
.tag-lists ul li:before {
  content:"·";
  font-size:40px;
  vertical-align:middle;
  line-height:20px;
}
.truncate-text {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
