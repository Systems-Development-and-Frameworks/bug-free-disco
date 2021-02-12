
import gql from 'graphql-tag'

export const GET_POSTS = gql`
query{
    posts{id, title, votes, voters{id}, author{id, name, email}}
}`
