const functions = require('firebase-functions');
const app = require('express')();
const { ApolloServer } = require('apollo-server-express')
const gql = require('graphql-tag')

const { db } = require('./utility/admin');

const typeDefs = gql`
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

const resolvers = {
    Query: {
        async getPosts() {
            try {
                posts = []
                await db.collection('posts').get()
                    .then(data => {
                        data.forEach(doc => {
                            posts.push({
                                id: doc.id,
                                text: doc.data().text,
                                owner: doc.data().owner,
                                createdAt: doc.data().createdAt
                            })
                        })
                    })
                return posts
            }
            catch(err) {
                console.log(err);
                throw new Error(err)
            }
            
        }
    }
}

const server = new ApolloServer( {typeDefs, resolvers} );
server.applyMiddleware( {app, path: "/", cors: true} )

exports.graphql = functions.https.onRequest(app)