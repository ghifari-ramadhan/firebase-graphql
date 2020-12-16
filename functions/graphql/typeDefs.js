const gql = require('graphql-tag')

module.exports = gql`
    type Post {
        id: String!
        text: String!
        owner: String!
        createdAt: String!
        likeCount: Int!
        commentCount: Int!
        likes: [Like]
        comments: [Comment]
    }

    type Comment {
        id: ID!
        createdAt: String!
        owner: String!
        text: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        owner: String!
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

        createComment(postId: String!, text: String!): Comment!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
`