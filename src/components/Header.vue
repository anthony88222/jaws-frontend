<template>
  <header>
    <div class="container">
      <div class="logo-container">
        <router-link to="/" class="site-logo">
          <img src="@/assets/logo2.png" alt="JAWS Logo" />
        </router-link>
      </div>
      <nav>
        <ul>
          <li><router-link to="/library">遊戲庫</router-link></li>
          <li><router-link to="/order-history">歷史訂單</router-link></li>
          <li><a href="#">商店</a></li>
          <li><router-link to="/login">登入 / 註冊</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-logo {
  display: inline-block;
  height: 70px;
}
.site-logo img {
  height: 100%;
  width: auto;
}
</style>
