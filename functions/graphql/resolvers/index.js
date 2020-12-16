const postsResolvers = require('./posts')
const commentsResolvers = require('./comments')
const usersResolvers = require('./users')

module.exports = {
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    }
}