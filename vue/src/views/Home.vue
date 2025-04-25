<template>
  <div class="library-home">
    <AuthModal 
      :mode="authMode" 
      :visible="isAuthModalVisible" 
      @close="closeAuthModal" 
      @update:mode="updateAuthMode"
    />
    <div class="search-container">
    <div class="search-box">
      <input
        v-model="localSearchQuery"
        placeholder="搜索书名/作者..."
        @keyup.enter="filterBooks"
      />
      <button class="search-btn" @click="filterBooks">
        <!-- <i class="search-icon">搜索</i> -->
         搜索
      </button>
    </div>
  </div>

  <div class="category-nav">
    <ul class="category-list">
      <li
        v-for="cat in categories"
        :key="cat"
        :class="{ active: selectedCategory === cat }"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </li>
      <li @click="selectCategory('')">全部分类</li>
    </ul>
  </div>

      <div class="content-container">
      <!-- 左侧：书籍信息 -->
      <div class="books-section">
        <div class="book-grid">
          <div
            v-for="book in displayedBooks"
            :key="book.id"
            class="book-card"
            @click="goToBookDetail(book.id)"
          >
            <div class="book-cover">
              <img :src="book.cover" :alt="book.title">
              <span :class="['status', book.statusText]">
                {{ getStatusText(book.statusText) }}
              </span>
            </div>
            <div class="book-info">
              <h3>{{ book.title }}</h3>
              <p class="author">{{ book.author }}</p>
              <div class="meta">
                <span class="category">{{ book.category }}</span>
                <span class="year">{{ book.year }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
            @click="setCurrentPage(page)"
          >
            {{ page }}
          </button>
        </div>
      </div>

      <!-- 右侧：排行榜 -->
      <div class="ranking-section">
        <div class="ranking-header">
          <h2>排行榜</h2>
          <button class="toggle-btn" @click="toggleRanking">{{ rankingVisible ? '收起' : '展开' }}</button>
        </div>
        <div v-if="rankingVisible">
          <div class="ranking-filter">
            <select v-model="selectedRankingCategory" @change="fetchRankingBooks">
              <option value="">全部分类</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
          <div class="ranking-list">
            <div v-for="(book, index) in rankingBooks" :key="book.id" class="ranking-item">
              <span class="ranking-index">{{ index + 1 }}</span>
              <span class="ranking-title">{{ book.title }}</span>
              <span class="ranking-reads">{{ book.read_volumn }} 阅读</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import AuthModal from '../components/AuthModal.vue';

export default {
  name: 'Home',
  components: {
    AuthModal
  },
  data() {
    return {
      localSearchQuery: '',
      isAuthModalVisible: false,
      authMode: 'login',
      selectedCategory: '',
      selectedRankingCategory: '', // 定义 selectedRankingCategory
      showRankingDropdown: false ,   // 定义 showRankingDropdown
      rankingVisible: true // 控制排行榜是否可见
    };
  },
  computed: {
    ...mapState([
      'books',
      'loading',
      'searchQuery',
      'currentPage',
      'pageSize',
      'isLoggedIn',
      'user',
      'rankingBooks'
    ]),
    ...mapGetters([
      'categories',
      'filteredBooks',
      'totalPages',
      'displayedBooks'
    ]),
    currentUserName() {
      return this.user ? this.user.user_name : null;
    }
  },
  methods: {
    ...mapActions(['fetchBooks', 'fetchRankingBooks']),
    getStatusText(status) {
      const statusMap = {
        available: '可借阅',
        borrowed: '已借出',
        reserved: '已预约'
      };
      return statusMap[status] || status;
    },
    goToBookDetail(bookId) {
      this.$router.push(`/book/${bookId}`);
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.filterBooks();
    },
    filterBooks() {
      this.$store.commit('SET_CURRENT_PAGE', 1);
      this.$store.commit('SET_SEARCH_QUERY', this.localSearchQuery);
      this.$store.commit('SET_SELECTED_CATEGORY', this.selectedCategory);
    },
    setCurrentPage(page) {
      this.$store.commit('SET_CURRENT_PAGE', page);
    },
    closeAuthModal() {
      this.isAuthModalVisible = false;
    },
    updateAuthMode(newMode) {
      this.authMode = newMode;
    },
    fetchRankingBooks() {
      this.$store.dispatch('fetchRankingBooks', this.selectedRankingCategory);
    },
    toggleRanking() {
      this.rankingVisible = !this.rankingVisible;
    }
  },
  created() {
    this.fetchBooks();
  }
};
</script>

<style scoped>
.library-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
}

.category-nav {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.category-nav button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.category-nav button.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.content-container {
  display: flex;
  gap: 30px;
}

.books-section {
  flex: 2;
}

.ranking-section {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.book-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  position: relative;
  height: 250px;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.book-info {
  padding: 15px;
}

.book-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.author {
  color: #666;
  margin-bottom: 5px;
}

.meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 14px;
}

.pagination {
  display: flex;
  gap: 5px;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #42b983;
  color: white;
}

.toggle-btn {
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.ranking-filter {
  padding: 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.ranking-filter select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.ranking-list {
  padding: 15px;
}

.ranking-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.ranking-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.ranking-index {
  font-weight: bold;
  margin-right: 15px;
  color: #42b983;
  width: 30px;
}

.ranking-title {
  flex-grow: 1;
  font-size: 16px;
}

.ranking-reads {
  color: #666;
  font-size: 14px;
}

/* 搜索功能以及分类导航栏 */
.search-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}


/* ======================================================================================================== */

.search-container {
  position: relative;
  max-width: 800px; /* 进一步增加最大宽度 */
  margin: 0 auto;
}

.search-box {
  display: flex;
  align-items: center;
  position: relative;
}

.search-box input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background-color: #f5f5f5;
  width: 800px; /* 增加输入框宽度 */
}

.search-box input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
  background-color: #ffffff;
}

.search-btn {
  position: absolute;
  right: 10px;
  top: 5px;
  width: 80px; /* 根据文字长度调整宽度 */
  height: 35px;
  border-radius: 20px;
  background-color: #42b983;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background-color: #3a9c73;
}
/* ======================================================================================================== */
.category-nav {
  margin-top: 15px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 10px;
}

.category-list li {
  padding: 8px 20px;
  border-radius: 20px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
}

.category-list li.active, .category-list li:hover {
  background-color: #42b983;
  color: white;
}

/* 增加分类导航的分隔线 */
.category-list li:not(:last-child) {
  margin-right: 10px;
}

/* 增加分类导航的悬停效果 */
.category-list li:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 增加分类导航的选中状态 */
.category-list li.active {
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}
</style>