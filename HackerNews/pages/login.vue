<template>
  <b-container class="bv-example-row">
    <b-row v-if="!isLoggedIn" class="item text-center">
      <LoginForm />
    </b-row>
    <b-row v-else>
      <b-col md="6" offset-md="3">
        <h1>You are already logged in</h1>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginForm from '../components/Login/LoginForm'
export default {
  name: 'App',
  components: {
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
</style>
