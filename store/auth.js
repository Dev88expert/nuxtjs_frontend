import Cookies from 'js-cookie'
const getUser = () => {
  if (process.client) {
    return JSON.parse(window.localStorage.getItem('user'))
  }
}
export default {
  namespaced: true,
  state() {
    return {
      user: getUser(),
      token: '',
    }
  },
  mutations: {
    Auth_token(state, payload) {
      state.token = payload
    },
    Login_User(state, payload) {
      state.user = payload
    },
    Auth_Logout(state) {
      Cookies.remove('access_token')
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
      ;(state.user = ''), (state.token = '')
    },
    Set_Token(state, payload) {
      state.token = payload
    },
  },
  actions: {
    logout({ commit, dispatch }) {
      auth().signOut()
      commit('loggedInUser', false)

      this.$router.push('/login')
    },
    loggedInUser({ commit }, payload) {
      commit('loggedInUser', payload)
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.isLogged
    },
    getAuthUser(state) {
      return state.auth_user
    },
    getToken(state) {
      return state.token
    },
  },
}
