import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { API_BASE } from '../config/constants';

// 创建axios实例
const service = axios.create({
  baseURL: `${API_BASE}/api/`,
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  NProgress.start()
  return config
}, error => {
  NProgress.done()
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    try{
      if(typeof(response.data) == 'string'){
        response.data = eval('('+response.data+')');
      }
    }catch(e){

    }
    // if (res.status == 'error') {
    //   Message({
    //     message: res.message,
    //     type: 'error',
    //     duration: 3 * 1000
    //   })
    //   return Promise.reject('error')
    // } else {
      NProgress.done()
      return response
    // }
  },
  error => {
    NProgress.done()

    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })

    return Promise.reject(error)
  }
)

export default service
