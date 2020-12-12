const { AuthenticationError } = require('apollo-server-express')

const { admin, db } = require('./admin');

module.exports = async (context) => {
    // context = { ...header }

    const authHeader = context.req.headers.authorization;
    console.log(authHeader);
    if(authHeader) {
        // Bearer ...
        const token = authHeader.split('Bearer ')[1]
        if(token){
            try {
                let user = {};
                await admin.auth().verifyIdToken(token)
                    .then(decodedToken => {
                        user = decodedToken
                        return db.collection('users').where('id', '==', user.uid).limit(1).get();
                    })
                    .then(data => {
                        console.log(data);
                        user.username = data.docs[0].data().username
                    })
                    .catch(err => {
                        console.log(err)
                        throw new AuthenticationError(err)
                    })

                console.log(user);
                return user
            }
            catch(err){
                console.log(err)
                throw new Error(err)
            }
        }
        throw new Error('Authentication header harus berformat \'Bearer [token]')
    }
    throw new Error('Authorization header tidak ditemukan')
}