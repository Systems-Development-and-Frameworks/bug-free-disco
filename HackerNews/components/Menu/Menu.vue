<template>
  <b-collapse id="nav-collapse" is-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-item v-if="!isLoggedIn" href="/login">
        Login
      </b-nav-item>
      <b-nav-item v-if="!isLoggedIn" href="/signup">
        Sign up
      </b-nav-item>
      <b-nav-item v-if="isLoggedIn" href="#">
        Welcome {{ userName }}
      </b-nav-item>
      <b-nav-item v-if="isLoggedIn" href="#" @click="exit">
        Logout
      </b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Menu',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('auth', ['isLoggedIn', 'userName'])
  },

  methods: {
    ...mapActions('auth', ['logout', 'showLoginModal', 'showSignupModal']),
    async exit () {
      await this.logout()
    }
  }
}
</script>

<style scoped>
</style>
