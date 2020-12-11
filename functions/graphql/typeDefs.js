const gql = require('graphql-tag')

module.exports = gql`
    type Post {
        id: String!
        text: String!
        owner: String!
        createdAt: String!
    }

    type User {
        id: ID!
        email: String!
        username: String!
        createdAt: String!
        token: String!
    }

    type Query {
        getPosts: [Post]
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
    }
`