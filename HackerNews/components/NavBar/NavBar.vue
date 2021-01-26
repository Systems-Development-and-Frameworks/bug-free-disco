<template>
  <div>
    <div>
      <NuxtLink to="/">
        Home
      </NuxtLink>
    </div>
    <div id="logSignDiv" v-if="!isLoggedIn">
      <NuxtLink to="/login">
        Login
      </NuxtLink>
      <NuxtLink to="/signup">
        Sign up
      </NuxtLink>
    </div>
    <div id="logoutDiv" v-else>
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
