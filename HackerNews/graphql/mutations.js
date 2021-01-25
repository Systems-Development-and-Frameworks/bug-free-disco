import gql from 'graphql-tag'

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

export const SIGNUP = gql`
  mutation signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password)
  }`

export const WRITE = gql`
mutation write($title: String!) {
  write(post: {title: $title}){id, title, votes, author{id, name, email}}
}`
