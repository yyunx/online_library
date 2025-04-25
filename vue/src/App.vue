<!-- <template>
  <div id="app">

    <NavBar @show-auth="handleAuthModal" />
    

    <AuthModal
      v-model:visible="authModalVisible"
      :mode="authMode"
      @close="closeAuthModal"
      @update:mode="updateAuthMode"
    />
    

    <router-view></router-view>
  </div>
</template> -->

<template>
  <div id="app">
    <!-- 导航栏组件 -->
    <NavBar 
      @show-auth="handleAuthModal" 
      @show-deposit="showDepositModal = true"
    />
    
    <!-- 认证模态框 -->
    <AuthModal
      v-model:visible="authModalVisible"
      :mode="authMode"
      @close="closeAuthModal"
      @update:mode="updateAuthMode"
    />
    
    <!-- 充值模态框 -->
    <DepositModal
      :visible="showDepositModal"
      @close="showDepositModal = false"
      @deposited="handleDeposited"
    />
    
    <!-- 主内容区域 -->
    <router-view></router-view>
  </div>
</template>

<script>
import { ref } from 'vue';
import NavBar from '@/components/Navbar.vue';
import AuthModal from '@/components/AuthModal.vue';
import DepositModal from '@/components/DepositModal.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    AuthModal,
    DepositModal
  },
  setup() {
    const authModalVisible = ref(false);
    const authMode = ref('login'); // 默认显示登录模式
    const showDepositModal = ref(false); // 控制充值模态框的显示状态

    const handleAuthModal = (mode) => {
      authMode.value = mode;
      authModalVisible.value = true;
    };

    const closeAuthModal = () => {
      authModalVisible.value = false;
    };

    const updateAuthMode = (newMode) => {
      authMode.value = newMode;
    };

    const handleDeposited = () => {
      // 处理充值成功后的逻辑，例如更新用户余额
      console.log('充值成功');
    };

    return {
      authModalVisible,
      authMode,
      showDepositModal,
      handleAuthModal,
      closeAuthModal,
      updateAuthMode,
      handleDeposited
    };
  }
};
</script>

<!-- <script>
import { ref } from 'vue';
import NavBar from '@/components/Navbar.vue';
import AuthModal from '@/components/AuthModal.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    AuthModal
  },
  setup() {
    // 使用 ref 创建响应式变量
    const authModalVisible = ref(false);
    const authMode = ref('login'); // 默认显示登录模式

    // 处理认证模态框显示
    const handleAuthModal = (mode) => {
      authMode.value = mode;
      authModalVisible.value = true;
    };

    // 关闭模态框
    const closeAuthModal = () => {
      authModalVisible.value = false;
    };

    // 更新认证模式（用于组件内部切换登录/注册）
    const updateAuthMode = (newMode) => {
      authMode.value = newMode;
    };

    return {
      authModalVisible,
      authMode,
      handleAuthModal,
      closeAuthModal,
      updateAuthMode
    };
  }
};
</script> -->

<style>
/* 全局样式 */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

</style>

