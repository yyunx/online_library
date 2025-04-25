<template>
  <div class="book-reader">
    <div class="reader-header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <h2>{{ book.title }}</h2>
      <div class="controls">
        <button @click="changeTheme('light')">浅色</button>
        <button @click="changeTheme('dark')">深色</button>
        <button @click="changeTheme('sepia')">护眼</button>
        <button @click="changeFontSize('increase')">A+</button>
        <button @click="changeFontSize('decrease')">A-</button>
      </div>
    </div>

    <div class="content" :style="{ fontSize: fontSize + 'px' }">
      {{ book.content }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookReader',
  data() {
    return {
      fontSize: 20,
      book: {},
      checkBalanceInterval: null,
      startReadTime: null,
      initialMoney: 0,
      accumulatedCost: 0,
      book: {
        title: "我的书籍",
        content: "这是书籍的内容。在这里可以添加更多的文本内容以供阅读。"
      },
      currentTheme: 'light' // 默认主题
    };
  },
  created() {
    this.fetchBookData();
    this.initialMoney = this.$store.state.user.money;
    this.startReadTime = Date.now();
    this.startBalanceCheck();
  },
  beforeUnmount() {
    clearInterval(this.checkBalanceInterval);
  },
  methods: {
    fetchBookData() {
      const bookId = this.$route.params.id;
      this.book = this.$store.state.books.find(book => book.id == bookId) || {};
    },
    changeFontSize(type) {
      if (type === 'increase' && this.fontSize < 28) {
        this.fontSize += 2;
      } else if (type === 'decrease' && this.fontSize > 16) {
        this.fontSize -= 2;
      }
    },
    changeTheme(theme) {
      this.currentTheme = theme;
      document.body.className = theme; // 切换主题类
    },
    goBack() {
      this.changeTheme("light");
      this.endReading();
    },
    async endReading() {
      // this.$router：可以返回上一页面
      await this.$store.dispatch('endReading', {
        book_id: this.book.id,
        user_id: this.$store.state.user.user_id
      }).then(()=>{this.$router.go(-1);});
    },
    startBalanceCheck() {
      this.checkBalanceInterval = setInterval(async () => {
        if (!this.startReadTime) return;

        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - this.startReadTime) / 1000);
        this.accumulatedCost = elapsedSeconds * 0.1;

        const remainingMoney = this.initialMoney - this.accumulatedCost;

        if (remainingMoney <= 0) {
          clearInterval(this.checkBalanceInterval);
          try {
            await this.endReading();
            if (confirm("您的余额已用完。是否前往充值？")) {
              this.$router.push('/profile');
            } else {
              this.$router.go(-1);
            }
          } catch (error) {
            console.error('结束阅读失败:', error);
          }
        }
      }, 1000);
    }
  }
};
</script>

<style scoped>
.book-reader {
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.back-btn {
  background-color: #4a86e8;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #3a76d8;
}

h2 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.controls button {
  margin-left: 10px;
  padding: 8px 15px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.controls button:hover {
  background: #e0e0e0;
}

.content {
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 40px;
  color: #333;
  font-size: 18px;
  transition: font-size 0.3s;
}

.content p {
  margin: 15px 0;
}
</style>

<style>
.light {
  background-color: #ffffff; /* 浅色主题的背景色 */
}

.light .book-reader {
  background-color: #f9f9f9;
}

.light .content {
  color: #333;
}

.dark {
  background-color: #121212; /* 深色主题的背景色 */
}

.dark .book-reader {
  background-color: #2d3436;
}

.dark .content {
  color: #dfe6e9;
}

.dark .back-btn, .dark .controls button {
  background-color: #636e72;
  color: #dfe6e9;
}

.dark .back-btn:hover {
  background-color: #525859;
}

.dark .controls button:hover {
  background: #747b7e;
}

.sepia {
  background-color: #f8f4e3; /* 护眼主题的背景色 */
}

.sepia .book-reader {
  background-color: #f4e8d9;
}

.sepia .content {
  color: #5d4037;
}
</style>