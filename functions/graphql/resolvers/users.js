const config = require('../../utility/config')
const { UserInputError } = require('apollo-server-express')
const encrypt = require('bcrypt')

const firebase = require('firebase')
const { db } = require('../../utility/admin')
firebase.initializeApp(config)


module.exports = {
    Mutation: {
        async register(_, { registerInput: {username, email, password, confirmPassword}}, context, info) {
            // TODO: Validate user input
            // TODO: Make sure user is unique
            // TODO: Add user details to database

            try {
                let userCredentials = {
                    username,
                    email,
                    createdAt: new Date().toISOString()
                };

                password = await encrypt.hash(password, 12)

                await db.doc(`/users/${username}`)
                        .get()
                        .then(doc => {
                            if (doc.exists) {
                                throw new UserInputError('Username tidak tersedia', {
                                    errors: { username: 'Username tidak tersedia' }
                                })
                            } else {
                                return firebase.auth().createUserWithEmailAndPassword(email, password)
                            }
                        })
                        .then(data => {
                            userCredentials.id = data.user.uid
                            return data.user.getIdToken()
                        })
                        .then(idToken => {
                            userCredentials.token = idToken

                            const userData = {
                                id: userCredentials.id,
                                username,
                                email,
                                createdAt: new Date().toISOString(),
                                profilePicture: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-img.png?alt=media`,
                                _private: []
                            }
                            userData._private.push({
                                hash: password, 
                                lastUpdate: new Date().toISOString()
                            })

                            return db.doc(`/users/${username}`).set(userData);
                        })

                return userCredentials
            }
            catch(err){
                console.log(err)
                if(err.code === 'auth/email-already-in-use') throw new UserInputError('Email yang anda input sudah digunakan pengguna lain')
                throw new Error(err)
            }
                
        }
    }
}