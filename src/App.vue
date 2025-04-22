<template>
  <Header />
  <div class="layout">
    <div class="container">
        <router-view /> <!-- 顯示目前路由的內容 -->
      </div>
    </div>
    <Footer />
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
