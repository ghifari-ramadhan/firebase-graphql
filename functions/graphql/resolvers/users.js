const config = require('../../utility/config')

const firebase = require('firebase')
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

                await firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(data => {
                        console.log(data);
                        userCredentials.id = data.user.uid
                        return data.user.getIdToken()
                    })
                    .then(idToken => {
                        userCredentials.token = idToken
                    })
                    
                return userCredentials
            }
            catch(err){
                console.log(err)
                throw new Error(err)
            }
                
        }
    }
}