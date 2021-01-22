<template>
  <form class="login-form" @submit.prevent="submit">
    <fieldset>
      <legend>Login</legend>
      <div>
        <div><label for="email">E-Mail</label></div>
        <div><label for="Password">Password</label></div>
      </div>
      <div>
        <div>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            size="25"
            name="email"
          >
        </div>
        <div>
          <input
            id="Password"
            v-model="formData.password"
            type="password"
            size="25"
            name="password"
          >
        </div>
        <div v-if="error" class="error">
          {{ error.message }}
        </div>
        <div>
          <button type="submit">
            Login
          </button>
        </div>
      </div>
    </fieldset>
  </form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      error: null,
      formData: {
        email: '',
        password: ''
      }
    }
  },
  computed: {},
  methods: {
    ...mapActions('auth', ['login']),
    async submit () {
      this.error = null
      try {
        const success = await this.login({ ...this.formData, apollo: this.$apollo })
        if (!success) { this.error = { message: 'Username or password is invalid' } } else {
          this.error = { message: 'Success' }
        }
      } catch (err) {
        this.error = { message: err }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p.alert {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}
</style>

<style>
.login-form fieldset {
  padding: 2rem;
  display: flex;
  flex-direction: row;
}

.login-form fieldset div {
  text-align: left;
}

.login-form fieldset div div {
  margin: 20px;
}
</style>
