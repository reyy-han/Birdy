const express = require("express");
const Users = require("./entities/users.js");

const Friends = require("./entities/friends.js");
const { default: friends } = require("./entities/friends.js");

const Messages = require("./entities/messages.js");
const { default: messages } = require("./entities/messages.js");

function init(db) {
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
    const friends = new Friends.default(db);
    const users = new Users.default(db);
    //POST Ajout Friend
    router.post("/user/:user_id(\\d+)/friends", async (req, res) => {
        const { login } = req.body;
        if(!login) {
            res.status(400).send("Missing fields");
        } else {
            const user = await users.get(req.params.user_id);
            if(!user) {
                res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
            } else {
                const unewfriend = await users.exists(login);
                if(!unewfriend) {
                    res.status(402).send(`Utilisateur ${login} n'existe pas`);
                }else{
                    users.getID(login)
                    .then((to_id) => {
                        let to_idJSON = JSON.stringify(to_id);
                        let to_idparse = JSON.parse(to_idJSON);
                        to_id = to_idparse.rowid
                        if(req.params.user_id == JSON.stringify(to_id)){
                            res.status(403).send(`On ne peut pas se suivre soi-même`);
                            return;
                        }
                        let date = Math.floor(Date.now() / 1000);

                        friends.create(req.params.user_id, to_id, date, db)
                        .then((friend_id) =>{
                            res.status(201).send({ id: friend_id })
                        })
                        .catch((err) => res.status(500).send(err));
                    });     
               }
            }
        }
    })

    //Get liste friends
    router
        .route("/user/:user_id(\\d+)/friends")
        .get(async (req, res) => {
        try{
            const user = await users.get(req.params.user_id);
            if(!user) {
                res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
            } else {
                let mesfriends = await friends.getFriends(req.params.user_id);
                if(! await friends.exists_from_id(req.params.user_id)){
                    res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas dans la table friend`);
                }
                if (!mesfriends){
                    res.sendStatus(404);
                }else{
                    let i = 0;
                    while(mesfriends[i]){
                        i++;
                    }
                    let j = 0;
                    mesfriends.forEach((r) => {
                        let mesfriendsJSON = JSON.stringify(r);
                        let mesfriendsparse = JSON.parse(mesfriendsJSON);
                        friend_id = mesfriendsparse.to_id;
                        users.getLogin(friend_id)
                        .then((login_friend) => {
                            Object.assign(r, login_friend);
                            j++;
                            if(j == i){
                                res.send(mesfriends);
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

    //GET chercher friend particulier
    router
        .route("/user/:user_id(\\d+)/friends/:friend_id(\\d+)")
        .get(async (req, res) => {
        try {
            const user = await users.get(req.params.user_id);
            const friend = await users.get(req.params.friend_id);
            if(!user) {
                res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
            } else {
                if(!friend) {
                    res.status(401).send(`Utilisateur ${req.params.friend_id} n'existe pas`);
                }else{
                    const friendship = await friends.get(req.params.user_id, req.params.friend_id);
                    if (!friendship)
                        res.sendStatus(404);
                    else{
                        // si on veut rendre la table d'amitié allant de from_id à to_id avec le login de to_id
                        let friend_parse = JSON.parse(JSON.stringify(friendship));
                        to_friend_id = friend_parse.to_id;
                        users.getLogin(to_friend_id)
                        .then((login_friend) => {
                            Object.assign(friendship, login_friend);
                            res.send(friendship);
                        })
                        .catch((err) => res.status(500).send(err));
                        // Sinon on peut faire une redirection sur la page de cet ami:
                       // res.redirect(`/api/user/${req.params.friend_id}`);
                    }
                }
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
        .delete(async (req, res, next) => {
            try{
                const user = await users.get(req.params.user_id);
                const friend = await users.get(req.params.friend_id);
                if(!user) {
                    res.status(401).send(`Utilisateur ${req.params.user_id} n'existe pas`);
                } else {
                    if(!friend) {
                        res.status(401).send(`Utilisateur ${req.params.friend_id} n'existe pas`);
                    }else{
                        const friendship = await friends.get(req.params.user_id, req.params.friend_id);
                        if(!friendship)
                            res.sendStatus(404).send(`Utilisateur ${req.params.user_id} ne suit pas l'uitlisateur ${req.params.friend_id}`);
                        else{
                            friends.unfollow(req.params.user_id,req.params.friend_id);
                            res.send(`delete friend ${req.params.friend_id}`);
                        }
                    } 
                }
            }
            catch (e) {
                res.status(500).send(e);
            }  
        });

    // GET informations,
    router
        .route("/infos")
        .get(async (req, res) => {
        try {
            await friends.number_friendship()
            .then(async (infos) =>{
                if(infos.count_friendship == 0){
                    res.send({
                        count_friendship: 0,
                        most_famous: 0,
                        followed_by: 0,
                        login: "no one",
                        count_I_follow: 0
                    })
                }else{
                    await friends.most_famous()
                    .then(async (famous) => {
                        Object.assign(infos, famous);
                        await users.getLogin(famous.most_famous)
                        .then(async (login) => {
                            Object.assign(infos, login);
                            
                            await friends.getNbMyFrom_id(famous.most_famous)
                            .then((nb_from_id) => {
                                Object.assign(infos, nb_from_id);
                            })
                            .catch((err) => res.status(500).send(err));
                            res.send(infos);
                        })
                        .catch((err) => res.status(500).send(err));
                    })
                    .catch((err) => res.status(500).send(err));
                }
                
            })

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
            await friends.getNbMyFrom_id(req.params.user_id)
            .then(async (r) =>{
                await friends.getNbMyTo_id(req.params.user_id)
                .then((nb_to_id) => {
                    Object.assign(r, nb_to_id);
                }) 
                .catch((err) => res.status(500).send(err));       
                res.send(r);
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
