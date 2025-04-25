<template>
  <div class="profile">
    <div class="profile-header">
      <h1>个人主页</h1>
      <router-link to="/" class="home-btn">返回主页</router-link>
    </div>
    
    <div class="profile-content" v-if="user">
      <div class="user-info-card">
        <h2>个人信息</h2>
        <div class="user-details">
          <p><span class="detail-label">用户名:</span> {{ user.user_name }}</p>
          <p><span class="detail-label">余额:</span> ¥{{  Math.abs(user.money).toFixed(2) }}</p>
        </div>
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
      
      <div class="reading-records-card">
        <h2>阅读记录</h2>
        <div v-if="loadingRecords" class="loading">加载中...</div>
        <div v-else-if="readRecords.length === 0" class="no-records">暂无阅读记录</div>
        <div v-else class="records-table">
          <table>
            <thead>
              <tr>
                <th>书籍名称</th>
                <th>开始阅读时间</th>
                <th>消费金额</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in readRecords" :key="record.record_id">
                <td>{{ record.title }}</td>
                <td>{{ record.begin_time }}</td>
                <td>¥{{ record.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div v-else class="loading">
      <p>加载用户数据中...</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      loadingRecords: false, // 添加 loadingRecords 属性
    };
  },
  computed: {
    ...mapState(['user', 'readRecords']),
  },
  methods: {
    ...mapActions(['logout', 'fetchUser', 'fetchReadRecords']),
  },
  mounted() {
    this.fetchUser(this.user.user_id);
    this.loadingRecords = true; // 设置加载状态为 true
    this.fetchReadRecords(this.user.user_id).finally(() => {
      this.loadingRecords = false; // 无论成功还是失败，最后都设置为 false
    });
  }
};
</script>

<style scoped>
.profile {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.home-btn {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.home-btn:hover {
  background-color: #3aa875;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.user-info-card, .reading-records-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.user-info-card h2, .reading-records-card h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.user-details {
  margin-bottom: 20px;
}

.detail-label {
  font-weight: bold;
  margin-right: 5px;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #ff5252;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
}

.no-records {
  text-align: center;
  padding: 20px;
  color: #666;
}

.records-table table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th, .records-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.records-table th {
  background-color: #f2f2f2;
}

.records-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.records-table tr:hover {
  background-color: #f1f1f1;
}
</style>