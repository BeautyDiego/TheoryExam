import axios from '@/libs/apiRequest'

export const login = (data) => {
  return axios.request({
    url: '/user/login',
    data: data,
    method: 'post'
  })
}

export const logout = (data) => {
  return axios.request({
    url: '/user/logout',
    data: data,
    method: 'post'
  })
}


