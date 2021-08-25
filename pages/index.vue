<template>
  <div>
    <Todo />
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import { getUserFromCookie } from '@/helpers'
export default {
  layout: 'admin',
  async asyncData({ req, redirect, store }) {
    let token = null
    if (process.server) {
      token = getUserFromCookie(req) // for ssr cookie
    } else {
      token = Cookies.get('token') // for no ssr cookie
    }
    if (!token) {
      redirect('/login')
    }
    return axios
      .get(' http://127.0.0.1:8000/api/todos', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((resp) => {
        if (resp.data.success) {
          store.commit('todos/Set_Todo', resp.data.result)
          store.commit('auth/Set_Token', token)
        }
      })
  },
  head(){
    return {
       title: "Todo App"
    }
  },
  methods: {
    signOut() {
      axios
        .post(
          ' http://127.0.0.1:8000/api/auth-logout',
          {},
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        )
        .then((resp) => {
          this.$store.commit('auth/Auth_Logout')
          this.$router.replace('/login')
        })
        .catch((err) => {
          this.$store.commit('auth/Auth_Logout')
          this.$router.replace('/login')
        })
    },
  },
}
</script>

<style>
.table {
    margin-top: 20px;
}
.table .thead-dark th {
    background-color: #0a91b9;
    border: none;
    border-right: 1px solid;
}
</style>
