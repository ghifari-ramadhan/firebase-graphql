const gql = require('graphql-tag')

module.exports = gql`
    type Post {
        id: String!
        text: String!
        owner: String!
        createdAt: String!
        likeCount: Int!
        commentCount: Int!
    }

    type User {
        id: ID!
        email: String!
        username: String!
        createdAt: String!
        token: String!
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!

        createPost(text: String!): Post!
        deletePost(postId: ID!): String!
    }
`