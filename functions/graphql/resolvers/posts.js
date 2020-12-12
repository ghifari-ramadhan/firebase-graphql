const { AuthenticationError } = require('apollo-server-express');

const { db } = require('../../utility/admin');
const FBAuth = require('../../utility/FBAuth')

module.exports = {
    Query: {
        async getPosts() {
            try {
                posts = []
                await db.collection('posts').orderBy('createdAt', 'desc').get()
                    .then(data => {
                        data.forEach(doc => {
                            posts.push({
                                id: doc.id,
                                text: doc.data().text,
                                owner: doc.data().owner,
                                createdAt: doc.data().createdAt,
                                likeCount: doc.data().likeCount,
                                commentCount: doc.data().commentCount,
                            })
                        })
                    })
                return posts
            }
            catch(err) {
                console.log(err)
                throw new Error(err)
            }
            
        },

        async getPost(_, { postId }) {
            try{
                let post = {};
                
                await db.doc(`/posts/${postId}`).get()
                                .then(doc => {
                                    console.log(doc.data())
                                    if(!doc.exists){
                                        throw new Error('Postingan tidak ditemukan')
                                    }
                                    else {
                                        post = doc.data()
                                        post.id = doc.id
                                    }
                                })
                                .catch(err => {
                                    console.log(err)
                                    throw new Error(err)
                                })

                return post

            }
            catch(err){
                console.log(err);
                throw new Error(err)
            }
        }
    },

    Mutation: {
        async createPost(_, { text }, context){

            const user = await FBAuth(context) // If this has no error it means that there is a user
            console.log(user);

            const newPost = {
                text,
                owner: user.username,
                createdAt: new Date().toISOString(),
                likeCount: 0,
                commentCount: 0
            }

            return await db.collection('posts').add(newPost)
                .then(doc => {
                    const post = newPost;
                    post.id = doc.id
                    return post
                })
                .catch(err => {
                    console.log(err)
                    throw new Error(err)
                })
        },

        async deletePost(_, { postId }, context){
            const user = await FBAuth(context)
            const document = db.doc(`/posts/${postId}`)

            try{
                await document.get()
                .then(doc => {
                    if(!doc.exists){
                        throw new Error('Postingan tidak ditemukan')
                    }
                    if(doc.data().owner !== user.username){
                        throw new AuthenticationError('Unauthorized!')
                    } else {
                        document.delete()
                    }
                })

                return 'Postingan sudah dihapus'
            }
            catch(err){
                console.log(err);
                throw new Error(err)
            }
        }
    }
}