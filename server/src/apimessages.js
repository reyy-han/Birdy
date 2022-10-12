const express = require("express");
const Users = require("./entities/users.js");

const Friends = require("./entities/friends.js");
const { default: friends } = require("./entities/friends.js");

const Messages = require("./entities/messages.js");
const { default: messages } = require("./entities/messages.js");

function init(db, mongodb) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    
    /* Messages */
    const messages = new Messages.default(mongodb);
    const users = new Users.default(db);
    const friends = new Friends.default(db);

    //POST ajout/création message 
    router.post("/user/:user_id(\\d+)/messages", async (req, res) => {
        const { message } = req.body;
        if (!message) {
            res.status(400).send("Missing fields");
        } else {
            const user = await users.get(req.params.user_id);
            if(!user) {
                res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
            } else {
                if(user) {
                    const login = await users.getLogin(req.params.user_id);
                    await messages.create(message, login, req.params.user_id)
                    .then((message_id) => {
                        res.status(201).send({ id: message_id });
                    })
                }
            }
        }
    })
    //Modif message 
    router
        .route("/user/:user_id(\\d+)/messages")
        .put(async (req, res) => {
        try{
            const { old_message, new_message } = req.body;
            const user = await users.get(req.params.user_id);
            if(!old_message || !new_message){
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : ancien et nouveau message nécessaire"
                });
                return;
            }
            else{
                if(!user){
                    res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
                }else{
                    if(! await messages.exists(req.params.user_id, old_message)){
                        res.status(401).send(`le message ${old_message} n'existe pas`);
                        return;
                    }
                    let idm = await messages.getDocumentID(req.params.user_id, old_message);
                    await messages.setDocument(req.params.user_id, old_message, new_message)
                    .then((nmessage) => res.status(201).send({ id: idm, newmessage: nmessage }))
                    .catch((err) => res.status(500).send(err));
                }   
            }
        }catch (e){
            res.status(500).send(e);
        }
    });   
    
    //DELETE supprimer message
    router   
        .route("/user/:user_id(\\d+)/messages")
        .delete(async (req, res, next) => {
            const { message } = req.body;
            try{
                if(!message){
                    res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : ancien et nouveau message nécessaire"
                    });
                    return;
                }
                else{
                    const user = await users.get(req.params.user_id);
                    if(!user) {
                        res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
                    } else {
                        if(! await messages.exists(req.params.user_id, message)){
                            res.status(401).send(`le message ${message} n'existe pas`);
                        }else{
                            let idm = await messages.getDocumentID(req.params.user_id, message);
                            messages.delete(req.params.user_id, message)
                            .then((message) => {
                                res.send(`delete message ${message} de id ${idm}`);
                            })
                           .catch((err) => res.status(500).send(err));
                        }
                    }
                }
            }
            catch (e) {
                res.status(500).send(e);
            }  
        }); 
        
    /* Get tous les messages dans la base de données*/
    router
        .route("/messages")
        .get(async (req, res) => {
        try{
            const mesmessages = await messages.getAllMessages();
            res.send(mesmessages);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    // GET liste messages of user_id
    router
        .route("/user/:user_id(\\d+)/messages")
        .get(async (req, res) => {
        try{
            const user = await users.get(req.params.user_id);
            if (!user){
                res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
            }else{
                const mesmessages = await messages.getMessages(req.params.user_id);
                res.send(mesmessages);
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    // get liste messages d'un ami friend_id
    router
        .route("/user/:user_id(\\d+)/messages/:friend_id(\\d+)") 
        .get(async (req, res) => {
        try{
            const user = await users.get(req.params.user_id);
            const friend = await users.get(req.params.friend_id);
            if(!user) {
                res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
            } else {
                if(!friend){
                    res.status(401).send(`Utilisateur ${req.params.friend_id} n'existe pas`);
                }else{
                    if(! await friends.exists(req.params.user_id, req.params.friend_id)){
                        res.status(401).send(`L'utilisateur ${req.params.user_id} ne suit pas l'utilisateur ${req.params.friend_id}`);
                        return;
                    }
                    /*const mesmessages = await messages.getMessages(req.params.friend_id);
                    res.send(mesmessages);*/
                    /* redirection */
                    res.redirect(`/apimessages/user/${req.params.friend_id}/messages`);
                }
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    })


    // get liste messages des amis de user
    router
        .route("/user/:user_id(\\d+)/messages/friends") 
        .get(async (req, res) => {
        try{
            const user = await users.get(req.params.user_id);
            if(!user) {
                res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
            } else {
                let mesfriends = await friends.getFriends(req.params.user_id);
                if(! await friends.exists_from_id(req.params.user_id)){
                    res.status(201).send(`Utilisateur ${req.params.user_id} n'existe pas dans la table friend`);
                }
                if (!mesfriends){
                    res.sendStatus(201).send(`Utilisateur ${req.params.user_id} n'existe pas dans la table friend`);
                }else{
                    liste_logins = [];
                    ok = false;
                    let i = 0;
                    while(mesfriends[i]){
                        i++;
                    }
                    let j = 0;
                    mesfriends.forEach((r) => {
                        friend_id = JSON.parse(JSON.stringify(r)).to_id;
                        users.getLogin(friend_id)
                        .then(async (login_friend) => {
                            liste_logins.push(login_friend.login)
                            j++;
                            if(j == i){ok = true;
                                const messagesfriends = await messages.getAllMessagesFriends(liste_logins);
                                if(messagesfriends[0]){
                                    res.send(messagesfriends);
                                }else{
                                    res.status(201).send(`Aucun ami de l'utilisateur ${req.params.user_id} n'a posté de message`);
                                }
                            }
                        })
                        .catch((err) => res.status(500).send(err));
                    })
                }
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    
    // GET informations,
    router
        .route("/infos")
        .get(async (req, res) => {
        try {
            await messages.number_messages()
            .then(async (infos) =>{
                res.send(infos);
            })
            .catch((err) => res.status(500).send(err));
                        
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    // GET informations of one user,
    router
        .route("/user/:user_id(\\d+)/infos")
        .get(async (req, res) => {
        try {
            await messages.nbMyMessages(req.params.user_id)
            .then(async (nb_messages) =>{      
                res.send(nb_messages);
            })
            .catch((err) => res.status(500).send(err));
                        
        }
        catch (e) {
            res.status(500).send(e);
        }
    })    
        
    return router;
}
exports.default = init;