import axios from "axios"
export default {
  namespaced: true,
  state() {
    return {
      todos: [],
    }
  },
  mutations: {
    Auth_token(state, payload) {
      state.token = payload
    },
    Set_Todo(state, payload) {
      state.todos = payload
    }
  },
  actions: {
    Fetch_Todos({ commit, req }, payload) {
      axios
        .get(' http://127.0.0.1:8000/api/todos', {
          headers: {
            Authorization: 'Bearer ' + payload,
          },
        })
        .then((resp) => {
          if (resp.data.success) {
            commit('Set_Todo', resp.data.result)
          }
        })
    },
    loggedInUser({ commit }, payload) {
      commit('loggedInUser', payload)
    },
  },
  getters: {
    todos(state) {
      let todos = [...state.todos]
      return [...todos];
    },
  },
}
