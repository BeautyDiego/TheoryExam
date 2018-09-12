// // cookie保存的天数
import {cookieExpires} from '@/config'
export const TOKEN_KEY = 'token'
export const IS_VIP = 'isVip'

export const setToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (token) return token
  else return false
}

export const getVipAuth = () => {
  const isVip = sessionStorage.getItem(IS_VIP)
  if (isVip) return isVip
  else return false
}

export const setChoosedSubjectInsessionStorage = choosedSubject => {
  sessionStorage.setItem('ChoosedSubject', choosedSubject)
}

export const getChoosedSubjectInsessionStorage =() => {
  const subject = sessionStorage.getItem('ChoosedSubject');
  return subject ? subject : 1
}

export const timestampToTime = (timestamp) => {
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y+M+D+h+m+s;
}
