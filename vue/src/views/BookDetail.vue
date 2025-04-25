<template>
  <div class="book-detail">
    <div class="action-bar">
      <button @click="$router.go(-1)" class="back-btn">← 返回</button>
    </div>

    <div class="book-header">
      <img :src="book.cover || defaultCover" class="detail-cover">
      <div class="book-meta">
        <h1>{{ book.title }}</h1>
        <p class="author">{{ book.author }}</p>
        <div class="meta-info">
          <span>分类: {{ book.category }}</span>
          <span>出版年: {{ book.year }}</span>
          <span>状态: {{ getStatusText(book.statusText) }}</span>
          <span>阅读量: {{ book.read_volumn }}</span>
        </div>
      </div>
    </div>

    <div class="book-content">
      <h2>内容简介</h2>
      <p class="description">{{ book.description || '暂无简介' }}</p>
    </div>

    <button 
      @click="startReading" 
      class="read-btn"

    >
      开始阅读
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'BookDetail',
  data() {
    return {
      book: {},
      defaultCover: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'%3E%3Crect width='100' height='150' fill='%23f5f5f5'/%3E%3Ctext x='50' y='80' font-family='Arial' font-size='14' text-anchor='middle' fill='%23999'%3E无封面%3C/text%3E%3C/svg%3E",
      statusText: {
        available: "可借阅",
        borrowed: "已借出",
        reserved: "已预约"
      }
    };
  },
  computed: {
    ...mapState(['user', 'books']),
    ...mapGetters(['isAuthenticated']),
    currentUserName() {
      return this.user ? this.user.user_name : null;
    },
    canStartReading() {
      return this.isAuthenticated && this.user.money > 0.00001;
    }
  },
  methods: {
    ...mapActions(['startReading', 'incrementReadVolumn']),
    getStatusText(status) {
      return this.statusText[status] || status;
    },
    fetchBookData() {
      const bookId = parseInt(this.$route.params.id);
      this.book = this.books.find(book => book.id === bookId) || {};
    },
    startReading() {
      if (!this.canStartReading) {
        alert("余额不足，无法开始阅读。");
        return;
      }
      this.$store.dispatch('startReading', { book_id: this.book.id, user_id: this.user.user_id });
      this.$store.dispatch('incrementReadVolumn', this.book.title);
      this.$router.push(`/book/${this.book.id}/read/1`);
    }
  },
  created() {
    this.fetchBookData();
  }
};
</script>

<style scoped>
  .book-detail {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-size: 18px; /* 增大基础字号 */
  }
  
  .action-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .book-header {
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
  }
  
  .detail-cover {
    width: 200px;
    height: 300px;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .book-meta h1 {
    font-size: 28px;
    margin-bottom: 15px;
  }
  
  .author {
    font-size: 20px;
    color: #666;
    margin-bottom: 20px;
  }
  
  .meta-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #777;
  }
  
  .book-content {
    line-height: 1.8;
  }
  
  .description {
    margin: 20px 0;
    font-size: 20px;
  }
  
  .chapter-list {
    margin: 40px 0;
  }
  
  .chapter-list li {
    padding: 12px 0;
    border-bottom: 1px dashed #eee;
    cursor: pointer;
    font-size: 18px;
  }
  
  .chapter-list li:hover {
    color: #42b983;
  }
  
  .read-btn {
    display: block;
    width: 200px;
    margin: 40px auto;
    padding: 15px;
    background: #42b983;
    color: white;
    font-size: 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .favorite-btn {
    background: none;
    border: 2px solid #f56c6c;
    color: #f56c6c;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
  }
  
  .favorite-btn.active {
    background: #f56c6c;
    color: white;
  }
</style>