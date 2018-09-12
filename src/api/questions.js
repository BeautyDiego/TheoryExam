import axios from '@/libs/apiRequest'

export const getQuestions = (data) => {
  return axios.request({
    url: '/user/questions',
    data: data,
    method: 'post'
  })
}

export const getExamQuestions = (data) => {
  return axios.request({
    url: '/user/exam',
    data: data,
    method: 'post'
  })
}
export const getFreeQuestions = (data) => {
  return axios.request({
    url: '/user/free_question',
    data: data,
    method: 'post'
  })
}

export const handInExam = (data) => {
  return axios.request({
    url: '/user/add_examhis',
    data: data,
    method: 'post'
  })
}

export const basicSkills = (data) => {
  return axios.request({
    url: '/user/basic_skills',
    data: data,
    method: 'post'
  })
}

