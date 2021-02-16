<template>
  <b-navbar toggleable="md" class="custom-header" type="dark" sticky>
    <b-container fluid="lg">
      <b-navbar-brand href="/">
        HackerNews
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <Menu />
    </b-container>
  </b-navbar>
</template>

<script>
import { mapActions } from 'vuex'
import Menu from '../Menu/Menu'

export default {
  name: 'Header',
  components: {
    Menu
  },

  data () {
    return {
      isMenuOpen: false
    }
  },
  computed: {
  },

  methods: {
    ...mapActions('auth', ['toggleSidebar']),
    hideSidebar () {
      this.toggleSidebar()
    }
  }
}
</script>

<style scoped>
</style>
