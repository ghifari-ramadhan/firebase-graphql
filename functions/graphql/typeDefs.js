const gql = require('graphql-tag')

module.exports = gql`
    type Post {
        id: String!
        text: String!
        owner: String!
        createdAt: String!
    }

    type Query {
        getPosts: [Post]
    }
`