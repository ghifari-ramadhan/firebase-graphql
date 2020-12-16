const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { db } = require('../../utility/admin');

const FBAuth = require('../../utility/FBAuth');

module.exports = {
    Mutation: {
        createComment: async (_, { postId, text }, context) => {
            const { username } = await FBAuth(context)

            if(text.trim() === '') throw new UserInputError('Kamu tidak bisa membuat postingan kosong', {
                errors: {
                    body: 'Comment body must not empty'
                }
            })

            const commentDocument = db.collection(`posts/${postId}/comments`);
            const postDocument = db.doc(`posts/${postId}`)

            const newComment = {
                text,
                owner: username,
                createdAt: new Date().toISOString(),
            }

            try{
                return await postDocument.get()
                            .then(doc => {
                                if(!doc.exists) throw new UserInputError('Postingan tidak ditemukan' )
                                else {
                                    post = doc.data();
                                    doc.ref.update({commentCount: doc.data().commentCount + 1})
                                    return commentDocument.add(newComment)
                                }
                            })
                            .then(doc => {
                                newComment.id = doc.id
                                doc.update({id: doc.id})
                                return newComment
                            })
                            .catch(err => {
                                console.log(err)
                                throw new Error(err)
                            })

            }
            catch(err){
                console.error(err)
                throw new Error(err)
            }
        }
    }
}