const express = require("express");
const Users = require("./entities/users.js");

const Friends = require("./entities/friends.js");
const { default: friends } = require("./entities/friends.js");

const Messages = require("./entities/messages.js");
const { default: messages } = require("./entities/messages.js");
const { resolve } = require("path");

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
    const users = new Users.default(db);
    const friends = new Friends.default(db);
    const messages = new Messages.default(mongodb);
    router.post("/user/login", async (req, res) => {
        try { 
            const { login, password } = req.body;
            // Erreur sur la requête HTTP
            if (!login || !password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }
            if(! await users.exists(login)) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            let userid = await users.checkpassword(login, password);
            if (userid) {
                // Avec middleware express-session
                req.session.regenerate(function (err) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, nouvelle session créée
                        req.session.userid = userid;
                        res.status(200).json({
                            status: 200,
                            message: "Login et mot de passe accepté",
                            id: userid
                        });
                    }
                });
                return userid;
            }
            // Faux login : destruction de la session et erreur
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

    //logout
    router.delete("/user/:user_id(\\d+)/logout", async (req, res) => {
        try {
            if(! await users.get(req.params.user_id)) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            else {
                // Avec middleware express-session
                req.session.destroy((err) => {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, session fermée
                        res.status(200).json({
                            status: 200,
                            message: "Session fermée"
                        });
                    }
                });
                return;
            }
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });
    
    // GET user_id fourni,
    router
        .route("/user/:user_id(\\d+)")
        .get(async (req, res) => {
        try {
            const user = await users.get(req.params.user_id);
            if (!user)
                res.sendStatus(404);
            else
                res.send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
        .delete(async (req, res, next) => {
        try{
            const user = await users.get(req.params.user_id);
            if(!user)
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
            else{
                let userJSON = JSON.stringify(user);
                let userparse = JSON.parse(userJSON);
                friends.getMyFrom_id(req.params.user_id)
                .then((mes_from_id) =>{
                    mes_from_id.forEach((f) =>{
                        let fparse = JSON.parse(JSON.stringify(f))
                        from_id = fparse.from_id;
                        to_id = fparse.to_id;
                        friends.unfollow(from_id,to_id);
                    })
                    friends.deleteAllFriendshipfrom_to_user(req.params.user_id);
                    messages.deleteAllof(req.params.user_id);
                    users.deleteUser(userparse.login);
                    res.send(`delete user ${req.params.user_id}`);
                })
            }
        }
        catch (e) {
            res.status(500).send(e);
        }  
    });  
    
    // creation Utilisateur d'un utilisateur fournie
    router.post("/user", (req, res) => {
        const { login, password, confirmpassword, lastname, firstname } = req.body;
        if (!login || !password || !confirmpassword || !lastname || !firstname) {
            res.status(400).send("Missing fields");
        } else {
            if(password != confirmpassword){
                res.status(400).send("Erreur password");
            }else{
                users.create(login, password, lastname, firstname)
                    .then((user_id) => res.status(201).send({ id: user_id }))
                    .catch((err) => res.status(500).send(err));
            }
            
        }
    });

    // GET informations,
    router
        .route("/user/infos")
        .get(async (req, res) => {
        try {
            await users.number_users()
            .then((nb_user) =>{
                res.send(nb_user);
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

