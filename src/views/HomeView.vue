<script setup lang="ts">
import Header from '@/components/Header.vue'
import SearchBar from '@/components/SearchBar.vue'
</script>

<template>
  <main class="main flex flex-row flex-wrap justify-center">
    <Header></Header>
    <section class="container">
        <SearchBar></SearchBar>
    </section>
  </main>
</template>

<style lang="css">
.main {

}
</style>
