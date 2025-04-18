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
          <li><router-link to="/">首頁</router-link></li>
          <li class="dropdown">
            <a href="#">遊戲庫</a>
            <ul class="dropdown-menu">
              <li><a href="#" id="list">動作遊戲</a></li>
              <li><a href="#" id="list">射擊遊戲</a></li>
              <li><a href="#" id="list">卡牌遊戲</a></li>
            </ul>
          </li>
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
