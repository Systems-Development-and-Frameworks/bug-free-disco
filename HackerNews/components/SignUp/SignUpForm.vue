<template>
  <form class="signup-form" @submit.prevent="submit">
    <fieldset>
      <legend>
        Sign up
      </legend>
      <div>
        <div><label for="name">Name</label></div>
        <div><label for="email">E-Mail</label></div>
        <div><label for="Password">Password</label></div>
        <div><label for="rePassword">Reenter password</label></div>
      </div>
      <div>
        <div>
          <input
            id="name"
            v-model="formData.name"
            type="name"
            size="25"
            name="name"
          >
        </div>
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
        <div>
          <input
            id="rePassword"
            v-model="formData.rePassword"
            type="password"
            size="25"
            name="rePassword"
          >
        </div>
        <div v-if="error" class="error">
          {{ error.message }}
        </div>
        <div>
          <button type="submit">
            Sign up
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
        name: '',
        email: '',
        password: '',
        rePassword: ''
      }
    }
  },
  computed: {},
  methods: {
    ...mapActions('auth', ['signup']),
    async submit () {
      this.error = null
      if (this.formData.password !== this.formData.rePassword) {
        this.error = { message: 'The password does not match!' }
        return
      }
      try {
        const success = await this.signup({
          ...this.formData,
          apollo: this.$apollo
        })
        if (!success) {
          this.error = { message: 'Registration failed' }
        } else {
          alert('Success')
          this.$router.push({ path: '/login' })
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
.signup-form fieldset {
  padding: 2rem;
  display: flex;
  flex-direction: row;
}

.signup-form fieldset div {
  text-align: left;
}

.signup-form fieldset div div {
  margin: 20px;
}
</style>
