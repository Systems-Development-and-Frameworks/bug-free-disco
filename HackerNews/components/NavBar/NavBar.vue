<template>
  <div>
    <div>
      <NuxtLink to="/">
        Home
      </NuxtLink>
    </div>
    <div v-if="!isLoggedIn" id="logSignDiv">
      <NuxtLink to="/login">
        Login
      </NuxtLink>
      <NuxtLink to="/signup">
        Sign up
      </NuxtLink>
    </div>
    <div v-else id="logoutDiv">
      <button @click="exit">
        Log out
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isLoggedIn'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async exit () {
      await this.logout()
    }
  }
}
</script>

<style scoped>

div a {
  font-size: 20px;
  padding-left: 20px;
}
div{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
