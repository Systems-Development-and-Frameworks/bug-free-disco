<template>
  <div id="app">
    <img alt="Hacker News" src="../assets/logo.png" width="50" height="50">
    <div v-if="isLoggedIn" class="container">
      <Home />
    </div>
    <div v-else class="container">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginForm from '../components/Login/LoginForm.vue'
import Home from '../components/Home/Home.vue'

export default {
  name: 'App',
  components: {
    Home,
    LoginForm
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn'])

  },

  methods: {
    //   ...mapMutations('auth', ['SET_TOKEN']),

  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img{
  margin: 30px;
}
.container{
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

}
</style>
