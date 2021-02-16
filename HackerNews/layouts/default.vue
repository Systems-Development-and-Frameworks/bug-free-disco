<template>
  <div>
    <Header />
    <Banner />
    <div>
      <nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header/Header'
import Banner from '@/components/Banner/Banner'
import Footer from '@/components/Footer/Footer'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Header,
    Banner,
    Footer
  },
  data () {
    return {
      mainProps: { blank: true, blankColor: '#777', width: 150, height: 150, class: 'm1' }
    }
  },
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

<style>
 html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}
.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}
.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.action-button {
  margin: 5px 0px;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.more-button {
  background-color: rgb(51, 51, 51);
  color: white;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 15px;
}

.item {
  padding: 15px;
}

.custom-header {
  background-color: black;
}

.custom-footer {
  background-color: black;
  color: white;
  padding: 10px 0px 10px 0px;
}
</style>
