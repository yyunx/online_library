//导入 axios 库，用于发送 HTTP 请求。     
import axios from 'axios';

// 设置基础 URL（假设后端 API 的基础路径）
const API_BASE_URL = 'http://127.0.0.1:8442';

// 创建 axios 实例
// baseURL：所有请求的基础 URL。
//timeout：请求超时时间（5 秒）。
//headers：默认请求头，设置为 application/json，表示发送的数据是 JSON 格式。
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});


export const fetchBooksAPI = () => {
  return apiClient.post('/book/getNum', {}, { timeout: 15000 }).then(response => {
    console.log("获取书籍信息：");
    console.log(response.data);
    
    // 将数组格式转换为对象格式
    const formattedBooks = response.data.map(book => {
      return {
        id: book[0],
        title: book[1],
        price: book[2],
        content: book[3],
        description: book[4],
        category: book[5],
        author: book[6],
        read_volumn: book[7]
      };
    });

    return formattedBooks;
  });
};

// b. 根据分类或搜索框筛选书籍
export const searchBooksAPI = (params) => {
  return apiClient.post('/book/find', params).then(response => {
    console.log("根据分类/搜索获取书籍信息：");
      console.log(response.data);
    return response.data;
  });
};

// 获取排行榜数据
export const fetchRankingAPI = (category) => {
  return apiClient.post('/books/ranking', { category }).then(response => {
    console.log("获取排行榜数据：");
    console.log(response.data);
    return response.data;
  });
};


// 增加阅读量
export const incrementReadVolumnAPI = (bookTitle) => {
  return apiClient.post('/book/read', { bookTitle }).then(response => {
    console.log("增加阅读量响应：");
    console.log(response.data);
    return response.data;
  });
};

// 在 api.js 中
export const startReadingAPI = (data) => {
  console.log(data)
  return apiClient.post('/read/start', data).then(response => {
    console.log("开始阅读响应：");
    console.log(response.data);
    return response.data;
  });
};
// 在 api.js 中
export const endReadingAPI = (data) => {
  console.log(data)
  return apiClient.post('/read/end', data).then(response => {
    console.log("结束阅读响应：");
    console.log(response.data);
    return response.data;
  });
};
// // 开始阅读：向后端发送‘user_name, book_id’添加一条阅读记录
// export const startReadingAPI = (data) => {
//     return apiClient.post('/read/start', data).then(response => {
//         console.log("获取阅读记录：");
//       console.log(response.data);
//       return response.data;
//     });
//   };

// // d. 结束阅读
// export const endReadingAPI = (data) => {
//   return apiClient.post('/read/end', data).then(response => {
    
//     return response.data;
//   });
// };

//-----注册、登录 以及充值

// a. 登录：向后端发送登录时的用户数据（用户名和密码），后端返回用户是否合法
// 在 api.js 中
export const loginAPI = (credentials) => {
  return apiClient.post('/user/login', credentials).then(response => {
      console.log("登录--返回是否合法：");
      console.log(response.data);
      return response.data;
  });
};

// 注册：向后端发送注册的数据，储存再用户表中
export const registerAPI = (userData) => {
  return apiClient.post('/user/register', userData).then(response => {
    console.log("获取注册后的用户表：");
    console.log(response.data);
    return response.data;
  });
};


// c. 充值：向后端发送充值请求，修改充值的金额
// 
export const depositAPI = (data) => {
  return apiClient.post('/user/recharge', data).then(response => {
    console.log("充值响应：");
    console.log(response.data);
    return response.data;
  });
};

//=============================================================================================

//获取用户数据
export const fetchUserAPI = (userId) => {
  return apiClient.post('/user/data', { userId }).then(response => {
      console.log("获取用户数据：");
      console.log(response.data);
      return response.data;
  });
};

// 获取用户阅读记录
export const fetchReadRecordsAPI = (userId) => {
  return apiClient.post('/user/cost', { userId }).then(response => {
    console.log("获取阅读记录：");
    console.log(response.data);
    return response.data;
  });
};

