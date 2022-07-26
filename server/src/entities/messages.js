const { resolve } = require("path");
class Messages {
  constructor(db){
      this.db = db;
  } 

  /**
   * Création d'un nouveau message, il sera caractérisé par : (de plus il aura une date de création)
   * @param {*} text son contenu
   * @param {*} author_name le nom de l'auteur
   * @param {*} author_id l'id de l'auteur
   */
  create(text, author_name, author_id){
    let login = JSON.parse(JSON.stringify(author_name)).login;
    let m = {author_id : author_id, author_name: login, date: new Date(), text: text};
    this.db.insert(m);
    return this.getDocumentID(author_id, text);
  }
   
  /**
   * 
   * @returns Retourne tous les messages de la base de données
   */
  getAllMessages(){
    return new Promise((resolve,reject)=>{
      this.db.find({}, {_id:1, author_name:1, author_id:1, text:1}, function(err, docs){
        if(err){
          reject(err);
        }else{
          resolve(docs);
        }
      });
    });
  }

  /**
   * Retourne la liste des messages de tous les amis indiqués dans la liste donnée en paramètre
   * @param {*} liste_friends liste contenant tous les logins des amis d'un user
   * @returns 
   */
  getAllMessagesFriends(liste_friends){
    return new Promise((resolve,reject)=>{
      this.db.find({author_name: {$in: liste_friends}}, {_id:1, author_name:1, author_id:1, text:1}, function(err, docs){
        if(err){
          reject(err);
        }else{
          resolve(docs);
        }
      });
    });
  }

  /**
   * Affiche tous les messages de l'auteur authorid
   * @param {*} authorid 
   */
  getMessages(authorid){
    return new Promise((resolve,reject)=>{
      this.db.find({author_id:authorid}, {_id:1, author_name:1, author_id:1, text:1}, function(err, docs){
        if(err){
          reject(err);
        }else{
          resolve(docs);
        }
      });
    });
  }

  /**
   * Recupère le id du message textM de l'auteur authorID s'il existe
   * @param {*} authorID 
   * @param {*} textM 
   * @returns l'id du message trouvé
   */
  getDocumentID(authorID, textM) {
    return new Promise((resolve, reject) => {
      this.db.find({author_id: authorID, text: textM}, {_id:1, author_id: 1}, function(err, docs){
        if(err){
          reject(err);
        }else{
          let id = docs[0]._id;
          resolve(id);
        }
      });
    });
  };

  /**
   * Remplace le message textM de authorID  par nvtext
   * @param {*} authorID l'auteur du message en question textM
   * @param {*} textM message à modifier
   * @param {*} nvtext nouveau texte qui va remplacer textM
   * @returns le nouveau message
   */
  setDocument(authorID, textM, nvtext){
    return new Promise((resolve, reject) => {
      this.db.update( {author_id: authorID, text: textM}, { $set: { text: nvtext } }, function(err, docs){
        if(err){
          reject(err);
        }else{
          resolve(nvtext);
        }
      });
    });
  }

  /**
   * Supprime le message textM de author ID si celui-ci existe
   * @param {*} authorID 
   * @param {*} textM 
   * @returns 
   */
  delete(authorID, textM){
    return new Promise((resolve, reject) => {
      this.db.remove({author_id: authorID, text: textM} ,function(err, docs){
        if(err){
          reject(err);
        }else{
          resolve(textM);
        }
      });
    });
  }
  
  /**
   * Teste si le message textM existe pour l'auteur authorID.
   * @param {*} authorID 
   * @param {*} textM 
   * @returns True si le message existe, False sinon.
   */
   exists(authorID, textM) {
    return new Promise((resolve, reject) => {
      this.db.find({author_id: authorID, text: textM}, {_id:1, author_id: 1}, function(err, docs){
        if(err){
          reject(err);
        }else{
          resolve(docs.length !== 0);
        }
      });
    });
  }

  /**
   * Supprime tous les messages de l'utilisateur d'id authorID
   * @param {*} authorID 
   */
  deleteAllof(authorID){
    this.getMessages(authorID)
    .then((messages) =>{
      messages.forEach((m) => {
        let msg_parse = JSON.parse(JSON.stringify(m));
        let authorid = msg_parse.author_id;
        let textM = msg_parse.text;
        this.delete(authorid,textM);
      })
    })
  }

  /**
   * 
   * @returns Le nombre de messages total dans le table des messages
   */
  number_messages(){
    return new Promise((resolve,reject)=>{
      this.db.find({}, {_id:1, author_name:1, author_id:1, text:1}, function(err, docs){
        if(err){
          reject(err);
        }else{
          resolve({count_messages : docs.length});
        }
      });
    });
  }

  /**
   * 
   * @param {*} authorid 
   * @returns La liste de messages du user d'id author_id
   */
  nbMyMessages(authorid){
    return new Promise((resolve,reject)=>{
      this.db.find({author_id:authorid}, function(err, docs){
        if(err){
          reject(err);
        }else{
          resolve({count_my_messages : docs.length});
        }
      });
    });
  }
  
  //fonctionne pas
  most_talkative(){
    return new Promise( (resolve, reject) =>{
      this.db.aggregate({ $group:{ _id:"$author_id", count: {$sum: 1} } }
        , function(err, docs){
            if (err){
              reject(err);
            }else{
              resolve(res);
            }
        })
    })
  }
}
exports.default = Messages;