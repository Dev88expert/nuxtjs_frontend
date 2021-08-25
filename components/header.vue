<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Todo</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <b-dropdown-item href="#" @click="signOut"
              >Sign Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
import {  mapGetters } from 'vuex'
import axios from "axios"
export default {
   computed: {
      ...mapGetters({
         token: 'auth/getToken',
      }),
   },
   methods:{
      signOut(){

         axios.post(' http://127.0.0.1:8000/api/auth-logout',{},
         {
            headers: { Authorization: 'Bearer ' + this.token }
         }
         ).then(resp => {
         this.$store.commit('auth/Auth_Logout')
         this.$router.replace('/login')
         }).catch(err => {
         this.$store.commit('auth/Auth_Logout')
         this.$router.replace('/login')
         })
      }
  }
}
</script>

<style></style>
