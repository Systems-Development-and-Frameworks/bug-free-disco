<template>
  <b-card title="Login" md="6" offset-md="3" class="item text-center">
    <ValidationObserver ref="observer">
      <b-form slot-scope="{ validate }" @submit.prevent="validate().then(handleSubmit)">
        <ValidationProvider rules="required|email" name="Email">
          <b-form-group
            id="input-group-1"
            slot-scope="{ valid, errors }"
            label="Email:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="email"
              type="email"
              :state="errors[0] ? false : (valid ? true : null)"
              placeholder="Enter the email"
            />
            <b-form-invalid-feedback>
              {{ errors[0] }}
            </b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>
        <ValidationProvider rules="required|min:8" name="Password" vid="password">
          <b-form-group
            id="input-group-2"
            slot-scope="{ valid, errors }"
            label="Password:"
            label-for="input-2"
          >
            <b-form-input
              id="input-2"
              v-model="password"
              type="password"
              placeholder="Enter the password"
              :state="errors[0] ? false : (valid ? true : null)"
            />
            <b-form-invalid-feedback>
              {{ errors[0] }}
            </b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>
        <b-button type="submit" variant="primary">
          Login
        </b-button>
      </b-form>
    </ValidationObserver>
  </b-card>
</template>

<script>
import { mapActions } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data () {
    return {
      error: null,
      email: '',
      password: ''
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleSubmit () {
      this.error = null
      try {
        const formData = { email: this.email, password: this.password }
        const success = await this.login({
          ...formData,
          apollo: this.$apollo
        })
        if (!success) {
          this.error = { message: 'Username or password is invalid' }
        } else {
          this.$router.push({ path: '/' })
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
form {
   max-width: 500px;
   margin: 0 auto;
   text-align: left;
}
.col-form-label {
    font-weight: 600;
}
</style>
