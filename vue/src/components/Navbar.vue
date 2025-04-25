<template>
  <nav class="navbar">
    <div class="nav-container">
      <h1 class="nav-title">欢迎光临在线数字图书馆系统</h1>
      <div class="nav-buttons">
        <template v-if="!isAuthenticated">
          <button @click="showAuthModal('login')" class="nav-button">登录</button>
          <button @click="showAuthModal('register')" class="nav-button">注册</button>
        </template>
        <template v-else>
          <span class="balance">余额: ¥{{ Math.abs(accountBalance).toFixed(2) }}</span>
          <button @click="showDepositModal" class="nav-button">充值</button>
          <router-link to="/profile" class="profile-btn">个人主页</router-link>
          <button @click="logout" class="nav-button">退出登录</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'NavBar',
  emits: ['show-auth', 'show-deposit'],
  setup(props, { emit }) {
    const store = useStore();
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const accountBalance = computed(() => store.getters.accountBalance);
    
    const showAuthModal = (mode) => {
      emit('show-auth', mode);
    };
    
    const showDepositModal = () => {
      emit('show-deposit');
    };
    
    const logout = async () => {
      await store.dispatch('logout');
    };
    
    return {
      isAuthenticated,
      accountBalance,
      showAuthModal,
      showDepositModal,
      logout
    };
  }
};
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.nav-title {
  margin: 0;
  font-size: 1.5rem;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-button, .profile-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-button {
  background-color: #42b983;
  color: white;
  border: none;
}

.profile-btn {
  background-color: #3498db;
  color: white;
  text-decoration: none;
}

.balance {
  margin-right: 1rem;
  font-weight: bold;
  color: #f1c40f;
}

</style>