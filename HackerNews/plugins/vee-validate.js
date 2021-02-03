import { extend } from 'vee-validate'
import { required, min, email, confirmed } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'This field is required'
})

extend('min', {
  ...min,
  message: 'This field must be at least 8 characters long'
})

extend('email', {
  ...email,
  message: 'The email should be a valid one. Ex.: xxx@domain.com'
})

extend('confirmed', {
  ...confirmed,
  message: 'The confirmation does not match with password'
})

extend('unique', {
  validate (value, args) {
    console.log(value)
    console.log(args.val)
    return args.val !== 'false'
  },
  params: ['val'],
  message: 'This title is already taken'
})
