<template>
  <div class="page-wrapper">
    <!-- 頁首 -->
    <Header />

    <!-- 主內容 -->
    <div class="page-content container">
      <router-view />
    </div>

    <!-- 頁尾 -->
    <Footer />
  </div>
</template>


<script setup>
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import Footer from './components/Footer.vue'
import HomeView from './views/HomeView.vue'
</script>

<style>
@import './styles/base.css';
@import './styles/variables.css';
@import './styles/layout.css';

</style>
