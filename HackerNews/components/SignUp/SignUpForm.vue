<template>
  <b-card md="6" offset-md="3" title="Sign Up" class="item text-center">
    <ValidationObserver ref="observer">
      <b-form slot-scope="{ validate }" @submit.prevent="validate().then(handleSubmit)">
        <ValidationProvider rules="required" name="Name">
          <b-form-group
            id="input-group-1"
            slot-scope="{ valid, errors }"
            label="Name:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="name"
              type="text"
              placeholder="Enter your name"
              :state="errors[0] ? false : (valid ? true : null)"
            />
            <b-form-invalid-feedback>
              {{ errors[0] }}
            </b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>
        <ValidationProvider rules="required|email" name="Email">
          <b-form-group
            id="input-group-2"
            slot-scope="{ valid, errors }"
            label="Email:"
            label-for="input-2"
          >
            <b-form-input
              id="input-2"
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
            id="input-group-3"
            slot-scope="{ valid, errors }"
            label="Password:"
            label-for="input-3"
          >
            <b-form-input
              id="input-3"
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
        <ValidationProvider rules="required|confirmed:password" name="Confirm Password">
          <b-form-group
            id="input-group-4"
            slot-scope="{ valid, errors }"
            label="Confirm Password:"
            label-for="input-4"
          >
            <b-form-input
              id="input-4"
              v-model="rePassword"
              type="password"
              placeholder="Confirm password"
              :state="errors[0] ? false : (valid ? true : null)"
            />
            <b-form-invalid-feedback>
              {{ errors[0] }}
            </b-form-invalid-feedback>
          </b-form-group>
        </ValidationProvider>
        <p v-if="error" class="alert">
          <b>{{ error.message }}</b>
        </p>
        <b-button type="submit" variant="primary">
          Sign up
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
      name: '',
      email: '',
      password: '',
      rePassword: ''
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('auth', ['signup']),
    async handleSubmit () {
      this.error = null
      try {
        const formData = { name: this.name, email: this.email, password: this.password }
        const success = await this.signup({
          ...formData,
          apollo: this.$apollo
        })
        if (!success) {
          this.error = { message: 'Registration failed' }
        } else {
          this.$router.push({ path: '/login' })
        }
      } catch (err) {
        this.error = { message: err }
      }
    }
  }
}
</script>

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
