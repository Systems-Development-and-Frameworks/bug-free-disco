
import gql from 'graphql-tag'

export const GET_POSTS = gql`
query{
    posts{id, title, votes, voters{id, name, email}, author{id, name, email}}
}`
