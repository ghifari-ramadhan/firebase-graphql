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

    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query {
        getPosts: [Post]
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
    }
`