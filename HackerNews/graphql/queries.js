
import gql from 'graphql-tag'

export const LOGIN = gql`
query{
    posts{id, title, votes, voters{id, name, email}, author{id, name, email}}
}`

