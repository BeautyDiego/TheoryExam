import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: sessionStorage.getItem('userName'),
    userId: sessionStorage.getItem('userId'),
    avatorImgPath: sessionStorage.getItem('avatorImgPath'),
    token: getToken(),
    isVip: sessionStorage.getItem('isVip'),
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setVip (state, isVip) {
      state.isVip = isVip
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    updateUserState(state){
      state.token = sessionStorage.getItem('token')
      state.userName = sessionStorage.getItem('userName')
      state.userId= sessionStorage.getItem('userId')
      state.isVip= sessionStorage.getItem('isVip')
    },
    handleLogin(state,user_info){
      state.token = user_info.session_key;
      setToken(user_info.session_key);
      state.userName = user_info.nick_name;
      state.userId= user_info.user_id;
      state.isVip= user_info.isvip;
      sessionStorage.setItem('token', user_info.session_key)
      sessionStorage.setItem('userName', user_info.nick_name)
      sessionStorage.setItem('userId', user_info.user_id)
      sessionStorage.setItem('isVip', user_info.isvip)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {user_info}) {
          debugger;
          commit('setToken', user_info.session_key)
          commit('setUserName', user_info.nick_name)
          commit('setUserId', user_info.user_id)
          commit('setVip', user_info.isVip)
    },
    handleLogOut ({ state, commit }) {

      commit('setToken','')
      commit('setVip', false)
      // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
      // commit('setToken', '')
      // commit('setAccess', [])
      // resolve()

    },
  },
    // 退出登录
}
