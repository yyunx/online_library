//使用 createStore 创建 Vuex 存储。
//从 ../api/index.js 导入与书籍、用户相关的 API 函数。
import { createStore } from 'vuex';
import { 
  fetchBooksAPI, 
  searchBooksAPI, 
  startReadingAPI, 
  endReadingAPI,
  loginAPI, 
  registerAPI, 
  depositAPI,
  fetchReadRecordsAPI,
  // fetchRankingBooksAPI,
  fetchUserAPI,
  fetchRankingAPI,
  incrementReadVolumnAPI
} from '../api/index.js';
//Vuex Store 配置，state、mutations、actions、getters 定义在其中
//CreateStore：是 Vuex 提供的函数，用于创建一个  全局状态管理对象。
export default createStore({
  //state 是 Vuex 的核心，用于存储应用的全局状态。
  //“全局变量”
  state: {
    user: null,
    users: [
      {
        user_id:0,
        user_name: "user1",
        password: "password1",
        account_balance: 1000.00
      }
    ],
    books: [
      {
        id: 1,
        title: "JavaScript高级程序设计",
        author: "Nicholas C. Zakas",
        category: "编程",
        price: 89.00,
        description:"123123123123123123132123",
        content: "JavaScript高级程序设计是一本全面深入的JavaScript指南，涵盖了ES6+的新特性。",
        read_volumn: 0
      },
      {
        id: 2,
        title: "三体",
        author: "刘慈欣",
        category: "科幻",
        price: 58.00,
        description:"123123123123123123132123",
        content: "三体是中国科幻文学的里程碑之作，讲述了地球文明与三体文明的接触和斗争。",
        read_volumn: 0
      },
      {
        id: 3,
        title: "活着",
        author: "余华",
        category: "文学",
        price: 39.50,
        description:"123123123123123123132123",
        content: "活着讲述了一个人在中国历史变迁中的苦难生活。",
        read_volumn: 0
      },
      {
        id: 4,
        title: "Python编程：从入门到实践",
        author: "Eric Matthes",
        category: "编程",
        price: 79.00,
        description:"123123123123123123132123",
        content: "Python编程：从入门到实践是一本全面的Python编程指南。",
        read_volumn: 0
      },
      {
        id: 5,
        title: "人类简史",
        author: "尤瓦尔·赫拉利",
        category: "历史",
        price: 68.00,
        description:"123123123123123123132123",
        content: "人类简史讲述了人类历史的演变。",
        read_volumn: 0
      }
    ],
    readRecords: [],
    isLoggedIn: false,
    loading: false,
    searchQuery: "",
    selectedCategory: "",
    currentPage: 1,
    pageSize: 6,
    rankingBooks: []
  },
  //mutations 是 Vuex 中唯一可以修改 state 的方式。     同步，将state中的数据更新为获取的数据
  //每个 mutation 是一个函数，接收 state 和 payload（传递的数据）
  mutations: {
    //SET_BOOKS：更新书籍列表。
    SET_BOOKS(state, books) {
      state.books = books;
    },
    //SET_LOADING：更新加载状态。
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    //
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query;
    },
    SET_SELECTED_CATEGORY(state, category) {
      state.selectedCategory = category;
    },
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },
    UPDATE_BOOK_READ_VOLUMN(state, { bookId, readVolumn }) {
      const bookIndex = state.books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        state.books[bookIndex].read_volumn = readVolumn;
      }
    },
    //注册、登录以及充值
    SET_LOGGED_IN(state, status) {
      state.isLoggedIn = status;
      if (!status) state.user = null; // 登出时清空用户
    },
    SET_USER(state, user) {
      console.log("set_user");
      // console.log(user)
      state.user = user;
      // console.log(state.user.user_id)
      state.isLoggedIn = !!user; // 同步更新登录状态
    },
    SET_READ_RECORDS(state, records) {
      state.readRecords = records;
    },
    ADD_USER(state, newUser) {
      console.log("add_user")
      state.users.push(newUser);
    },
    UPDATE_USER(state, { index, user }) {
      state.users.splice(index, 1, user);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_RANKING_BOOKS(state, books) {
      state.rankingBooks = books;
    }
  },
  //actions 用于处理异步逻辑（如 API 请求）。
  //通过调用 mutations 来更新 state。
  //============后端数据 -- 后端程序 -- api -- action -- mutation -- state ==============
  //相当于：前端数据与后端数据的接口   
  actions: {
    // a. 获取所有书籍
    //调用 API 获取书籍列表，并通过 SET_BOOKS 更新状态
    async fetchBooks({ commit }) {
      console.log("获取图书");
      commit('SET_LOADING', true);
      try {
        const books = await fetchBooksAPI();
        commit('SET_BOOKS', books); 
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // // 获取排行榜数据
    // async fetchRankingBooks({ commit }, category) {
    //   console.log("排行榜");
    //   commit('SET_LOADING', true);
    //   try {
    //     const books = await fetchRankingBooksAPI(category);
    //     commit('SET_BOOKS', books);
    //   } catch (error) {
    //     console.error('获取排行榜数据失败:', error);
    //   } finally {
    //     commit('SET_LOADING', false);
    //   }
    // },

    //根据分类或搜索框筛选书籍
    async searchBooks({ commit }, { category, searchQuery }) {
      console.log("搜索图书");
      commit('SET_LOADING', true);
      try {
        const params = { category, searchQuery };
        const books = await searchBooksAPI(params);
        commit('SET_BOOKS', books);
      } catch (error) {
        console.error('Failed to search books:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    //获取排行榜数据
    async fetchRankingBooks({ commit }, category) {
      commit('SET_LOADING', true);
      try {
        const response = await fetchRankingAPI(category);
        if (response.success) {
          commit('SET_RANKING_BOOKS', response.books);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('获取排行榜数据失败:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },


    // 增加阅读量（也是在开始阅读前）
    async incrementReadVolumn({ commit }, bookTitle) {
      console.log("增加阅读量");
      commit('SET_LOADING', true);
      try {
        const response = await incrementReadVolumnAPI(bookTitle);
        if (response.success) {
          console.log("阅读量增加成功");
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('增加阅读量失败:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
        // 开始阅读
    async startReading({ commit, state }, { book_id, user_id }) {
      console.log("开始阅读");
      if (!state.user) {
        throw new Error('用户未登录');
      }
      commit('SET_LOADING', true);
      try {
        const response = await startReadingAPI({ book_id, user_id });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response;
      } catch (error) {
        console.error('开始阅读失败:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    // 结束阅读时更新数据
    // 在 store.js 的 actions 中
    async endReading({ commit, state }, { book_id, user_id }) {
      console.log("结束阅读");
      if (!state.user) {
        throw new Error('用户未登录');
      }
      commit('SET_LOADING', true);
      try {
        const response = await endReadingAPI({ book_id, user_id });
        if (response.success) {
          // 更新用户余额
          commit('SET_USER', {
            ...state.user,
            money: response.new_money
          });
          return response;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('结束阅读失败:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    //========================================================
    // 登录
    async login({ commit }, credentials) {
      console.log("登录");
      commit('SET_LOADING', true);
      try {
          const response = await loginAPI(credentials);
          console.log("login:response")
          console.log(response)
          if (response.success) {
              // 登录成功
              commit('SET_USER', response.user);
              // console.log(response.user)
              // console.log("登录后的user：")
              // console.log(this.user)
              return response.user;
          } else {
              // 登录失败
              throw new Error(response.message);
          }
      } catch (error) {
          console.error('登录失败:', error);
          throw error;
      } finally {
          commit('SET_LOADING', false);
      }
    },

    // 注册
    async register({ commit, dispatch }, userData) {
      console.log("注册");
      console.log(userData);
      commit('SET_LOADING', true);
      try {
          const response = await registerAPI(userData);
          if (response.success) {
              // 注册成功
              commit('ADD_USER', userData);
              commit('SET_USER', userData);
              console.log("注册后的user：")
              console.log(this.user)  //
              // 使用后端返回的用户ID
              await dispatch('fetchUser', response.user_id);
              return userData;
          } else {
              // 注册失败
              throw new Error(response.message);
          }
      } catch (error) {
          console.error('注册失败:', error);
          throw error;
      } finally {
          commit('SET_LOADING', false);
      }
    },

    // 充值
    // async deposit({ commit }, amount) { ------> 不正确的
    //deposit({ commit, state }  {}  中的数据为传入的参数，如果在函数中要使用到state时，需要在此处进行传参的操作
    async deposit({ commit, state }, amount) {
      console.log("充值");
      commit('SET_LOADING', true);
      try {
        //在执行充值操作之前，检查了用户是否已登录（if (!state.user)），如果没有登录，则抛出错误
        if (!state.user) {
          throw new Error('用户未登录');
        }

        const response = await depositAPI({ money: amount, user_id: state.user.user_id });
        if (response.success) {
          // 更新用户余额
          commit('SET_USER', { ...state.user, money: state.user.money + amount });
          return true;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('充值失败:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    //获取用户数据
    async fetchUser({ commit }, userId) {
      try {
          const response = await fetchUserAPI(userId);
          if (response.success) {
              commit('SET_USER', response.user);
          } else {
              throw new Error(response.message);
          }
      } catch (error) {
          console.error('获取用户数据失败:', error);
          throw error;
      }
    },

    //获取阅读记录
    async fetchReadRecords({ commit }, userId) {
      commit('SET_LOADING', true);
      try {
        const response = await fetchReadRecordsAPI(userId);
        console.log("response.data");
        console.log(response.records);
        if (response.success) {
          commit('SET_READ_RECORDS', response.records);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('获取阅读记录失败:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // 退出登录
    logout({ commit }) {
      console.log("登出");
      commit('SET_LOGGED_IN', false);
    }

  },
  //getters 是 Vuex 中的计算属性，用于派生状态。
  //getters 是响应式的，可以监听状态变化。  在state发生变化时，会‘通知’前端页面
  getters: {
    //categories：从书籍列表中提取所有分类。
    categories: state => {
      return [...new Set(state.books.map(book => book.category))];
    },
    //filteredBooks：根据搜索关键词和分类筛选书籍。
    filteredBooks: state => {
      return state.books.filter(book => {
        // 确保 book.title 和 book.author 存在
        const title = book.title || '';
        const author = book.author || '';
        const matchesSearch = title.includes(state.searchQuery) || author.includes(state.searchQuery);
        const matchesCategory = !state.selectedCategory || book.category === state.selectedCategory;
        return matchesSearch && matchesCategory;
      });
    },
    totalPages: (state, getters) => {
      return Math.ceil(getters.filteredBooks.length / state.pageSize);
    },
    displayedBooks: (state, getters) => {
      const start = (state.currentPage - 1) * state.pageSize;
      return getters.filteredBooks.slice(start, start + state.pageSize);
    },
    isAuthenticated: state => !!state.user,
    accountBalance: state => state.user?.money || 0,
    isLoggedIn: state => !!state.user,
    currentUser: state => state.user

  }
});