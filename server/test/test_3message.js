const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); // c'est l'app "express"
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API message", () => {
    mocha.it("message", (done) => {
        const request = chai.request(app.default).keepOpen();
        const message1 = {
            message: "I wish but don't want to"
        }
        const modification = {
            "old_message" : "I wish but don't want to",
            "new_message" : "Je suis ton ami!"
        }
        request
            .post('/apimessages/user/1/messages')
            .send(message1)

            .then((res) => {
                res.should.have.status(201);
                res_id = res.body.id;
                console.log(`Retrieving message _id : ${res_id}`)
                const message = {
                    author_id: "1",
                    text: "I wish but don't want to",
                    author_name: "pikachu",
                    _id: res.body.id
                };
                const message_modif = {
                    author_id: "1",
                    text: "Je suis ton ami!",
                    author_name: "pikachu",
                    _id: res.body.id
                };
                console.log("message : ", message);
                return Promise.all([
                    request 
                        .get(`/apimessages/user/1/messages`)
                        .then((res) => {
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body, [message])
                        }), 
                    request 
                        .put(`/apimessages/user/1/messages`)
                        .send(modification)
                        .then((res) => {
                            res.should.have.status(201)
                            const nmsg = { id: res_id, newmessage: "Je suis ton ami!"}
                            chai.assert.deepEqual(res.body, nmsg)
                            request 
                                .get(`/apimessages/user/1/messages`)
                                .then((res) => {
                                    res.should.have.status(200)
                                    chai.assert.deepEqual(res.body, [message_modif])
                                }) 
                        }), 
                    
                    request 
                        .get(`/apimessages/messages`)
                        .then((res) => {
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body, [message])
                        }),
                    request 
                        .delete(`/apimessages/user/1/messages`)
                        .send(message1)
                        .then((res) => {
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body, {})
                        }), 
                        
                ])
            })
            .then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })
})