const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); // c'est l'app "express"
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API friend", () => {
    mocha.it("friend", (done) => {
        const request = chai.request(app.default).keepOpen();
        const user1 = {
            login: "KevinAdams",
            password: "rosita",
            confirmpassword: "rosita",
            lastname: "Tribbiani",
            firstname: "Joey"
        };
        const user1_res = {
            login: "KevinAdams",
            password: "rosita",
            lastname: "Tribbiani",
            firstname: "Joey"
        };
        const login = {
            login : "KevinAdams"
        };
        request
            .post('/api/user')
            .send(user1)

            .then((res) => {
                res.should.have.status(201);
                console.log(`Retrieving user ${res.body.id}`)
                return Promise.all([
                    request 
                        .get(`/api/user/${res.body.id}`)
                        .then((res) => {
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body, user1_res)
                        }), 
                    request
                        .get(`/api/user/4`)
                        .then((res) => {
                            res.should.have.status(404)
                        }),
                ])
            })
        request
            .post('/apifriends/user/1/friends')
            .send(login)
        
            .then((res) => {
                res.should.have.status(201);
                console.log(`Retrieving friend ${res.body.id}`)
                const friendship = {
                    from_id: "1",
                    to_id: "2",
                    timestamp: Math.floor(Date.now()/1000),
                    login: "KevinAdams"
                };
                return Promise.all([
                    request 
                        .get(`/apifriends/user/1/friends`)
                        .then((res) => {
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body, [friendship])
                        }), 
                    
                    request
                        .get(`/apifriends/user/2/friends`)
                        .then((res) => {
                            res.should.have.status(401)
                        }),

                    request 
                        .delete(`/apifriends/user/1/friends/2`)
                        .then((res) => {
                            res.should.have.status(200)
                        }),
                    
                    request 
                        .delete(`/apifriends/user/1/friends/3`)
                        .then((res) => {
                            res.should.have.status(401)
                        }),
                ])
            })
            .then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })
})