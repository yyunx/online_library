<template>
  <div v-if="visible" class="deposit-modal-overlay">
    <div class="deposit-modal">
      <div class="modal-content">
        <button class="close-btn" @click="close">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <div class="deposit-header">
          <h2>账户充值</h2>
          <p>当前余额: ¥{{ Math.abs(currentBalance).toFixed(2) }}</p>
        </div>
        
        <form @submit.prevent="handleDeposit">
          <div class="form-group">
            <label for="amount">充值金额 (元)</label>
            <input 
              id="amount"
              v-model="amount" 
              type="number" 
              min="0.01"
              step="0.01"
              required
              placeholder="请输入充值金额"
            >
            <p v-if="error" class="error-message">{{ error }}</p>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? '处理中...' : '确认充值' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'DepositModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'deposited'],
  setup(props, { emit }) {
    const store = useStore();
    const amount = ref('');
    const isSubmitting = ref(false);
    const error = ref('');
    
    const currentBalance = computed(() => store.getters.accountBalance);
    
    const close = () => {
      amount.value = '';
      error.value = '';
      emit('close');
    };
    
    const handleDeposit = async () => {
      error.value = '';
      isSubmitting.value = true;
      
      try {
        const depositAmount = parseFloat(amount.value);
        
        if (isNaN(depositAmount) || depositAmount <= 0) {
          throw new Error('请输入有效的充值金额');
        }
        
        await store.dispatch('deposit', depositAmount);
        emit('deposited');
        close();
      } catch (err) {
        error.value = err.message;
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return {
      amount,
      currentBalance,
      isSubmitting,
      error,
      close,
      handleDeposit
    };
  }
};
</script>

<style scoped>
.deposit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.deposit-modal {
  width: 100%;
  max-width: 400px;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #888;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.deposit-header {
  margin-bottom: 25px;
}

.deposit-header h2 {
  margin-top: 0;
  color: #333;
}

.deposit-header p {
  color: #666;
  font-size: 16px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #42b983;
  outline: none;
}

.error-message {
  color: #ff5252;
  margin-top: 8px;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #3aa875;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>