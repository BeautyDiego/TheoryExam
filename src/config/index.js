let baseURL = 'http://localhost:8030'
let mediaURL = 'http://120.79.130.11:8030'
let frontWebURL = 'http://localhost:8080'
const cookieExpires=1;
if (process.env.NODE_ENV === 'production') {
     // baseURL = 'http://120.79.130.11:8030'
     // frontWebURL = 'http://120.79.130.11:8031'
     baseURL =  'http://47.106.169.11:8030';
     frontWebURL = 'http://47.106.169.11:8031';
     mediaURL = 'http://47.106.169.11:8030'
}

export  {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires,
  /**
   * @description 后台请求地址
   */
  baseURL,
  /**
   * @description 前端地址
   */
  frontWebURL,
  mediaURL
}
