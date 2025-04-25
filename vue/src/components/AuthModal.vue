<template>
  <div v-if="visible" class="auth-modal" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
      
      <div class="auth-header">
        <h2>{{ mode === 'login' ? '欢迎回来' : '创建账户' }}</h2>
        <p>{{ mode === 'login' ? '登录您的账户继续' : '立即注册开始您的旅程' }}</p>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input 
            v-model="form.username" 
            type="text" 
            required
            placeholder=" "
          >
          <label>用户名</label>
          <div class="underline"></div>
        </div>
        
        <div class="form-group">
          <input 
            v-model="form.password" 
            type="password" 
            required
            placeholder=" "
          >
          <label>密码</label>
          <div class="underline"></div>
        </div>
        
        <div v-if="mode === 'register'" class="form-group">
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            required
            placeholder=" "
          >
          <label>确认密码</label>
          <div class="underline"></div>
          <p v-if="passwordMismatch" class="error-message">密码不一致</p>
        </div>
        
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? '处理中...' : mode === 'login' ? '登录' : '注册' }}
        </button>
      </form>

      <div class="auth-footer">
        <p v-if="mode === 'login'">
          还没有账户？<a href="#" @click.prevent="switchMode">立即注册</a>
        </p>
        <p v-else>
          已有账户？<a href="#" @click.prevent="switchMode">立即登录</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AuthModal',
  props: {
    mode: {
      type: String,
      default: 'login',
      validator: value => ['login', 'register'].includes(value)
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'update:mode'],
  setup(props, { emit }) {
    const store = useStore();
    
    const form = ref({
      username: '',
      password: '',
      confirmPassword: ''
    });
    
    const isSubmitting = ref(false);
    const passwordMismatch = ref(false);
    
    const passwordsMatch = computed(() => 
      form.value.password === form.value.confirmPassword
    );
    
    const close = () => {
      resetForm();
      emit('close');
    };
    
    const resetForm = () => {
      form.value = {
        username: '',
        password: '',
        confirmPassword: ''
      };
      passwordMismatch.value = false;
      isSubmitting.value = false;
    };
    
    const switchMode = () => {
      const newMode = props.mode === 'login' ? 'register' : 'login';
      emit('update:mode', newMode);
    };
    
  // 在 AuthModal.vue 的 handleSubmit 方法中
const handleSubmit = async () => {
  if (props.mode === 'register' && !passwordsMatch.value) {
    passwordMismatch.value = true;
    return;
  }

  isSubmitting.value = true;

  try {
    const credentials = {
      user_name: form.value.username,  // 确保使用 user_name 字段
      password: form.value.password
    };

    if (props.mode === 'login') {
      await store.dispatch('login', credentials);

    } else {
      await store.dispatch('register', credentials);
    }

    close();
  } catch (error) {
    alert(error.message || '操作失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};


    return {
      form,
      isSubmitting,
      passwordMismatch,
      passwordsMatch,
      close,
      switchMode,
      handleSubmit
    };
  }
};
</script>

<!-- 
<template>
  <div v-if="visible" class="auth-modal" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
      
      <div class="auth-header">
        <h2>{{ mode === 'login' ? '欢迎回来' : '创建账户' }}</h2>
        <p>{{ mode === 'login' ? '登录您的账户继续' : '立即注册开始您的旅程' }}</p>
      </div>


      <div v-if="errorMessage" class="global-error">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input 
            v-model.trim="form.username" 
            type="text" 
            required
            placeholder=" "
            :disabled="isSubmitting"
          >
          <label>用户名</label>
          <div class="underline"></div>
        </div>
        
        <div class="form-group">
          <input 
            v-model.trim="form.password" 
            type="password" 
            required
            placeholder=" "
            :disabled="isSubmitting"
            minlength="6"
          >
          <label>密码</label>
          <div class="underline"></div>
          <p v-if="mode === 'register'" class="hint-text">至少6位字符</p>
        </div>
        
        <div v-if="mode === 'register'" class="form-group">
          <input 
            v-model.trim="form.confirmPassword" 
            type="password" 
            required
            placeholder=" "
            :disabled="isSubmitting"
            @input="validatePasswordMatch"
          >
          <label>确认密码</label>
          <div class="underline"></div>
          <p v-if="passwordMismatch" class="error-message">密码不一致</p>
        </div>
        
        <button 
          type="submit" 
          class="submit-btn" 
          :disabled="isSubmitting || (mode === 'register' && passwordMismatch)"
          :class="{ 'loading': isSubmitting }"
        >
          <span v-if="!isSubmitting">
            {{ mode === 'login' ? '登录' : '注册' }}
          </span>
          <span v-else>处理中...</span>
        </button>
      </form>

      <div class="auth-footer">
        <p v-if="mode === 'login'">
          还没有账户？<a href="#" @click.prevent="switchMode">立即注册</a>
        </p>
        <p v-else>
          已有账户？<a href="#" @click.prevent="switchMode">立即登录</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed,toRefs } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AuthModal',
  props: {
    mode: {
      type: String,
      default: 'login',
      validator: value => ['login', 'register'].includes(value)
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'update:mode', 'success'],
  setup(props, { emit }) {
    const { mode } = toRefs(props); // 正确解构 props
    const store = useStore();
    
    const form = ref({
      username: '',
      password: '',
      confirmPassword: ''
    });
    
    const isSubmitting = ref(false);
    const passwordMismatch = ref(false);
    const errorMessage = ref('');

    // 修改 handleSubmit 方法
    const handleSubmit = async () => {
      if (mode.value === 'register' && form.value.password !== form.value.confirmPassword) {
        errorMessage.value = '两次输入的密码不一致';
        return;
      }

      isSubmitting.value = true;
      errorMessage.value = '';

      try {
        const credentials = {
          user_name: form.value.username,
          password: form.value.password
        };

        if (mode.value === 'login') {
          await store.dispatch('login', credentials);
        } else {
          await store.dispatch('register', credentials);
        }
        
        emit('success');
        close();
      } catch (error) {
        errorMessage.value = error.message || '请求失败，请重试';
        console.error('Auth Error:', error); // 打印完整错误
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      form,
      isSubmitting,
      passwordMismatch,
      errorMessage,
      handleSubmit,
      close,
      switchMode
    };
  }
};
</script> -->

<style scoped>
/* 样式与之前相同 */
.auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 380px;
  max-width: 90%;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.4s ease-out;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 0.5rem;
  transition: all 0.2s;
  border-radius: 50%;
}

.close-btn:hover {
  color: #333;
  background: rgba(0,0,0,0.05);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.auth-header p {
  color: #666;
  font-size: 0.9rem;
}

.form-group {
  position: relative;
  margin-bottom: 1.8rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem 0;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 1rem;
  background: transparent;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-bottom-color: #42b983;
}

.form-group input:focus + label,
.form-group input:not(:placeholder-shown) + label {
  transform: translateY(-1.5rem) scale(0.85);
  color: #42b983;
}

.form-group label {
  position: absolute;
  left: 0;
  top: 0.8rem;
  color: #999;
  font-size: 1rem;
  transition: all 0.3s;
  pointer-events: none;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #42b983;
  transition: width 0.3s;
}

.form-group input:focus ~ .underline {
  width: 100%;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #42b983, #3aa876);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(66, 185, 131, 0.2);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(66, 185, 131, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.auth-footer a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-footer a:hover {
  color: #3aa876;
  text-decoration: underline;
}

.error-message {
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}


/* 新增样式 */
.global-error {
  color: #ff4444;
  background: #ffeeee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
}

.hint-text {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
}

.submit-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>