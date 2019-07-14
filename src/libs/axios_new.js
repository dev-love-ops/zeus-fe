import Axios from 'axios'
import Cookies from 'js-cookie'
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
      accessToken: 'test'
  }
  // GET请求的时候参数格式稍有不同
  if (type === 'get')  {
    data = {params: data, headers: headers}
  }

  Axios[type](url, data, headers).then(res => {

    successCallback(res)

  }).catch(error => {
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      // console.log(error.response.data);
      // console.log(error.response.headers);
      console.log(error.response.status);
      // 401 unauthorized
      if (error.response.status == 401) {
        // 跳转到登录页面
        return
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    // console.log(error.config);
  })
}

export default axios
