const { db } = require('../../utility/admin');

module.exports = {
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