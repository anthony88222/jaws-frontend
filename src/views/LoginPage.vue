<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h1 class="login-title">LOGIN</h1>
      <form class="login-form" @submit.prevent="login">
        <label for="username">用戶名</label>
        <input id="username" type="text" v-model="username" required />

        <label for="password">密碼</label>
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '隱藏' : '顯示' }}
          </button>
        </div>

        <div class="remember-me">
          <input type="checkbox" id="remember" v-model="rememberMe" />
          <label for="remember">記住我</label>
        </div>

        <button class="btn-neon" type="submit">LOGIN</button>
      </form>

      <div class="register-link">
        <a href="#" class="neon-link">建立帳號</a>
        <span class="divider">|</span>
        <a href="#" class="neon-link">忘記密碼？</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);

function login() {
  alert(`登入帳號：${username.value}\n記住我：${rememberMe.value}`);
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 75vh;
  background: url('/assets/bg-login.jpg') no-repeat center center;
  background-size: cover;
  padding: 1rem;
}

.login-box {
  background-color: #1a1a2a;
  padding: 2rem;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px var(--color-primary);
  width: 55vh;
  max-width: 800px;
  text-align: center;
}

.login-title {
  color: var(--color-secondary);
  text-shadow: 0 0 12px var(--color-secondary);
  font-size: 2.5rem;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.login-form label {
  display: block;
  text-align: left;
  color: var(--color-text);
  margin-bottom: 0.3rem;
  text-shadow: 0 0 4px var(--color-primary);
}

.login-form input[type='text'],
.login-form input[type='password'] {
  width: 90%;
  margin-bottom: 1.2rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-primary);
  background: transparent;
  color: var(--color-text);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  text-shadow: 0 0 4px var(--color-primary);
  outline: none;
}

.input-group {
  position: relative;
}

.input-group .toggle-password {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  background: transparent;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  text-shadow: 0 0 6px var(--color-primary);
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  font-size: 0.85rem;
  text-shadow: 0 0 4px var(--color-primary);
}

.btn-neon {
  display: inline-block;
  width: 35%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
  font-weight: bold;
  text-shadow: 0 0 8px var(--color-primary);
  transition: var(--transition);
  cursor: pointer;
  border-radius: var(--border-radius);
}

.btn-neon:hover {
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow: 0 0 20px var(--color-primary);
}

.register-link {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.neon-link {
  color: var(--color-secondary);
  font-size: 0.9rem;
  text-shadow: 0 0 6px var(--color-secondary);
  text-decoration: none;
  transition: color var(--transition);
}

.neon-link:hover {
  color: yellow;
  text-shadow: 0 0 8px var(--color-primary);
}

.divider {
  color: var(--color-muted);
  text-shadow: 0 0 3px var(--color-muted);
}
</style>
