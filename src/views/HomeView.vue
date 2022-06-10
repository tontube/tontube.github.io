<script setup lang="ts">
import Header from '@/components/Header.vue'
import SearchBar from '@/components/SearchBar.vue'
import MoviesList from '@/components/MoviesList.vue'
</script>

<template>
  <main class="main">
    <Header></Header>
    <section class="container mx-auto">
        <SearchBar></SearchBar>
        <MoviesList></MoviesList>
    </section>
  </main>
</template>

<style lang="css">
</style>
