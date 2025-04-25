<template>
  <div class="book-reader">
    <div class="reader-header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <h2>{{ book.title }}</h2>
      <div class="controls">
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
      accumulatedCost: 0
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
    goBack() {
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
  padding: 20px;
}

.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.content {
  line-height: 2;
  text-align: justify;
  margin-bottom: 40px;
}

.controls button {
  margin-left: 10px;
  padding: 5px 10px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
</style>