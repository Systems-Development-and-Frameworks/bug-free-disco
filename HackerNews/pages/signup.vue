
<template>
  <div id="app">
    <div v-if="!isLoggedIn" class="container">
      <SignUpForm />
    </div>
    <div v-else>
      <h1>You are already logged in</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SignUpForm from '../components/SignUp/SignUpForm'

export default {

  name: 'App',
  components: {
    SignUpForm
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

.container{
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

}
</style>
