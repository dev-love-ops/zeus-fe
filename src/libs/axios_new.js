import Axios from 'axios'
import router from '@/router'
import { Message } from 'iview'
import { getStorage } from '@/libs/storage'
/**
 * @param {String} type 请求类型 GET或POST
 * @param {String} url 请求地址
 * @param {Object} data 请求参数, 参数为空的时候需要传递一个空字典: {}
 * @param {Function} success 成功回调
 * @param {Function} fail 失败回调
 */

function axios(type, url, data, successCallback, failCallback){
  // 将请求方法统一变成小写, 比如GET变成get
  type = type.toLowerCase()
  // 定义请求header
  let headers = {
    Authorization: 'Bearer ' + getStorage('token')
  }
  // GET/DELETE请求的时候第二个参数会多包装一层
  // POST请求方式比较常规, 第二个参数就作为参数
  //PUT的请求方式的话会从第二个参数中取数据, 从第三个参数中去相关的配置信息, 比如header等
  if (type === 'get')  {
    data = {params: data, headers: headers}
  }
  if (type === 'delete')  {
    data = {data: data, headers: headers}
  }

  Axios[type](url, data, {headers}).then(res => {

    if (res.data.code === 0){
      successCallback(res.data.data)
    } else {
      Message.error({
        content: res.data.message,
        duration: 3
      })
    }

  }).catch(error => {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      // console.log(error.response.data);
      // console.log(error.response.headers);
      console.log(error.response);

      if (error.response.status === 401) {
        // 跳转到登录页面
        router.push({
          name: 'login'
        })

      } else if (error.response.status === 403){

        Message.error({
          content: '用户无权限',
          duration: 3
        })

      }

  })
}

export default axios
