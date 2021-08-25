<template>
  <div
    id="login_form"
    :style="{
      'background-color': '#f8f8f8',
      'backgroundRepeat': 'no-repeat',
      'background-size': 'cover',
    }"
  >
    <div id="inner_form" class="row">
      <div class="col-sm-12">
        <div class="login_width">
          <h3>Register In</h3>
          <b-alert v-if="showError" show variant="danger">{{
            errMessage
          }}</b-alert>
          <b-form @submit.prevent="onSubmit">
            <b-form-group
              id="input-group-1"
              label="Username"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                type="text"
                v-model="form.name"
                placeholder="Enter username"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Email" label-for="input-1">
              <b-form-input
                id="input-1"
                type="email"
                v-model="form.email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Password"
              label-for="input-2"
            >
              <b-form-input
                id="input-2"
                type="password"
                v-model="form.password"
                placeholder="Enter password"
                required
              ></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">
              <b-spinner v-if="loginLoading" small></b-spinner>
              Register</b-button
            >
            <b-button variant="primary" @click="$router.push('/login')">
              Login</b-button
            >
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import { getUserFromCookie } from '@/helpers'
export default {
  async asyncData({ req, redirect, route }) {
    if (process.server) {
      const user = getUserFromCookie(req)
      if (user) {
        redirect('/')
      }
    }
  },
  components: {},
  props: {
    pageTitle: {
      type: String,
      default: 'Login Page',
    },
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        name: '',
      },
      showError: false,
      errMessage: '',
      loginLoading: false,
    }
  },
  mounted() {},

  methods: {
    async onSubmit() {
      this.loginLoading = true
      this.showError = false
      const url = ' http://127.0.0.1:8000/api/register'
      await axios
        .post(url, {
          email: this.form.email,
          password: this.form.password,
          name: this.form.name,
        })
        .then((resp) => {
          this.loginLoading = false
          if (resp.data.success) {
            this.showError = true
            this.errMessage = 'Please login to continue !'
          } else {
            this.loginLoading = falses
            ;(this.showError = true), (this.errMessage = 'Invalid Credential !')
          }
        })
        .catch((err) => {
          this.loginLoading = false
          this.showError = true
          this.errMessage = 'Invalid Credential !'
          console.log(err)
        })
    },
  },
}
</script>
<style>
#login_form {
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
}
.login_width {
  width: 400px;
  margin: 0 auto;
  background: #ffffff;
  padding: 0px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid#e1e1e1;
}
.login_width form {
    padding: 25px;
}
.login_width label {
  margin-bottom: 2px;
  font-size: 14px;
}
button.btn.btn-primary {
  background-color: #0a91b9 !important;
  border-color: #0a91b9 !important;
  text-transform: uppercase;
  color: #fff !important;
  font-size: 14px;
  outline: none;
  width: 100%;
  height: 40px;
  margin: 0;
  margin-top: 10px;
  -webkit-transition: all 1s ease;
  transition: all 1s ease;
}
button.btn.btn-primary:hover {
    background-color: transparent !important;
    color: #0a91b9 !important;
}
.login_width h3 {
    text-align: center;
    font-size: 20px;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #0a91b9;
    color: #fff;
}
</style>
