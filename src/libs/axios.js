import Axios from 'axios'
import { baseURL } from '@/config'
import { Message } from 'iview'
import { getToken } from '@/libs/util'
class httpRequest {
  constructor () {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
  }
  // 销毁请求实例
  destroy (url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }
  // 请求拦截
  interceptors (instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      if (!config.url.includes('/user/login')) {
        config.headers['SessionKey'] = getToken()
      }
      // Spin.show()
      // 在发送请求之前做些什么
      return config
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error)
    })

    // 添加响应拦截器
    instance.interceptors.response.use((res) => {
      const is = this.destroy(url)
      if (!is) {
        setTimeout(() => {
          // Spin.hide()
        }, 500)
      }
      //console.log(res)
      //if (res.data.status !== 0) {
       // return false
      //}
      return res.data
    }, (error) => {
      let message='服务内部错误';

      switch (error.response.status) {
        case 400:
          message = '请求错误'
          break

        case 401:
          message = '需要VIP权限才能继续访问';
          setTimeout(function(){
            window.location='/'; 
          },
            500);

          break

        case 403:
          message = '拒绝访问'
          break

        case 404:
          message = `请求地址出错: ${error.response.config.url}`
          break

        case 408:
          message = '请求超时'
          break

        case 500:
          message = '服务器内部错误'
          break

        case 501:
          message = '服务未实现'
          break

        case 502:
          message = '网关错误'
          break

        case 503:
          message = '服务不可用'
          break

        case 504:
          message = '网关超时'
          break

        case 505:
          message = 'HTTP版本不受支持'
          break

        default:
          message= '服务内部错误'
      }
      Message.error(message)
      // 对响应错误做点什么
      return Promise.reject(error)
    })
  }
  // 创建实例
  create () {
    let conf = {
      baseURL: baseURL,
      // timeout: 2000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // 'X-URL-PATH': baseURL,
      },
    }
    return Axios.create(conf)
  }
  // 合并请求实例
  mergeReqest (instances = []) {
    //
  }
  // 请求实例
  request (options) {
    var instance = this.create()
    this.interceptors(instance, options.url)
    options = Object.assign({}, options)
    this.queue[options.url] = instance
    return instance(options)
  }
}
export default httpRequest
