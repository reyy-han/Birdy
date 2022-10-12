const { resolve } = require("path");
const Users = require("./users.js");


class Friends {
  constructor(db){
    this.db = db;
    this.db.exec("CREATE TABLE IF NOT EXISTS friends (from_id VARCHAR(512), to_id VARCHAR(512), timestamp TIMESTAMP, PRIMARY KEY (`from_id`,`to_id`))");  
  }

  /**
   * Permet de créer un enetrée dans la table friends, tel que from_id suive to_id.
   * @param {*} from_id id de l'utilisateur qui suit to_id
   * @param {*} to_id id de la personne suivie par from_id
   * @param {*} timestamp depuis quelle date from_id suit to_id
   * @returns 
   */
  create(from_id, to_id, timestamp){
    let _this = this;
    return new Promise( (resolve, reject) =>{
      var stmt = _this.db.prepare("INSERT INTO friends VALUES (?,?,?)");
      stmt.run([from_id,to_id,timestamp],function(err,res){
        if (err){
          reject(err);
        }else{
          resolve(this.lastID);
        }
      })
    })
  } 

  /**
   * Rend le nombre d'amitié allant de notre user from_id dans la table friends
   * @param {*} from_id id de notre user
   * @returns 
   */
  getNbMyFrom_id(from_id){
    return new Promise( (resolve, reject) =>{
        var stmt = this.db.prepare("SELECT COUNT(rowid) as count_I_follow FROM friends WHERE from_id = ?");      
        stmt.get([from_id], function(err,res){
            if (err){
              reject(err);
            }else{
              resolve(res);
            }
        })
    })
  }

  /**
   * Rend le nombre d'amitié allant vers notre user to_id dans la table friends
   * @param {*} to_id id du user intéressé
   * @returns 
   */
  getNbMyTo_id(to_id){
    return new Promise( (resolve, reject) =>{
        var stmt = this.db.prepare("SELECT COUNT(rowid) as count_follow_me FROM friends WHERE to_id = ?");      
        stmt.get([to_id], function(err,res){
            if (err){
              reject(err);
            }else{
              resolve(res);
            }
        })
    })
  }
  
  /**
   * 
   * @returns le nombre total d'amitié dans la table friends
   */
  number_friendship(){
    return new Promise( (resolve, reject) =>{
        var stmt = this.db.prepare("SELECT COUNT(rowid) as count_friendship FROM friends ");      
        stmt.get(function(err,res){
            if (err){
              reject(err);
            }else{
              resolve(res);
            }
        })
    })
  }
  /**
   * 
   * @returns Rend l'id de l'utilisateur étant le plus suivi dans la table friends
   */
  most_famous(){
    return new Promise( (resolve, reject) =>{
        var stmt = this.db.prepare("SELECT to_id as most_famous, COUNT(from_id) as followed_by FROM friends GROUP BY to_id ORDER BY COUNT(from_id) DESC LIMIT 1");      
        stmt.get(function(err,res){
            if (err){
              reject(err);
            }else{
              resolve(res);
            }
        })
    })
  }

  /**
   * 
   * @param {*} from_id 
   * @param {*} to_id 
   * @returns Les informations de l'amitié entre les deux ids (depuis from_id vers to_id)
   */
  get(from_id, to_id){
    return new Promise((resolve,reject)=>{
        var stmt = this.db.prepare("SELECT * FROM friends WHERE from_id = ? AND to_id = ?");
        stmt.get([from_id, to_id],function(err,res){
            if (err){
              reject(err);
            }else{
              resolve(res);
            }
        })
    })
  }

  /**
   * La fonction renvoie la liste d'amis de l'utilisateur from_id dans la base de données friends
   * @param {*} from_id correspond à l'utilisateur dont on veut connaître les amis
   * @returns Nous renvoie la liste d'amis de from_id (i.e. : tous les to_id de from_id)
   */
  getFriends(from_id){
    return new Promise((resolve,reject)=>{
        var stmt = this.db.prepare("SELECT * FROM friends WHERE from_id = ?");
        stmt.all([from_id],function(err,res){
            if (err){
              reject(err);
            }else{
              resolve(res);
            }
        })
    })
  }
  

  /**
   * Teste si from_id suit(follow) to_id
   * @param {*} from_id 
   * @param {*} to_id 
   * @returns 
   */
  async exists(from_id, to_id){
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT from_id FROM friends WHERE from_id = ? AND to_id = ?");
      stmt.get([from_id, to_id],function(err,res){
        if (err){
            reject(err);
        }else{
            resolve(res !== undefined);
        }
      })
    })
  }

  /**
   * Teste si from_id suit(follow) to_id
   * @param {*} from_id 
   * @param {*} to_id 
   * @returns 
   */
   async exists_from_id(from_id){
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT from_id FROM friends WHERE from_id = ? ");
      stmt.get([from_id],function(err,res){
        if (err){
            reject(err);
        }else{
            resolve(res !== undefined);
        }
      })
    })
  }

  /**
   * La fonction permet à from_id d'arreter de suivre to_id, si le lien n'existe pas, la fonction ne fait rien
   * @param {*} from_id unfollow to_id
   * @param {*} to_id is unfollowed by from_id
   * @returns 
   */
  unfollow(from_id, to_id){
    return new Promise((resolve, reject) => {
      if(this.exists(from_id, to_id)){
        var stmt = this.db.prepare("DELETE FROM friends WHERE from_id = ? AND to_id = ?");
        stmt.get([from_id, to_id], function(err,res){
          if (err){
            reject(err);
          }else{
            resolve(res);
          }
        })
      }
    })
  }

  /**
   * Supprime tous les liens d'amitié allant de from_id dans la tables friends
   * @param {*} id 
   * @returns 
   */
  deleteAllFriendshipfrom_to_user(id){
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("DELETE FROM friends WHERE from_id = ? OR to_id = ?");
      stmt.get([id], function(err,res){
        if (err){
          reject(err);
        }else{
          resolve(res);
        }
      })
    })
  }

  /**
   * 
   * @param {*} to_id 
   * @returns La liste des amitiés allant de from_id vers les autres dans la table friends.
   */
  getMyFrom_id(to_id){
    return new Promise((resolve,reject)=>{
        var stmt = this.db.prepare("SELECT * FROM friends WHERE to_id = ?");
        stmt.all([to_id],function(err,res){
            if (err){
              reject(err);
            }else{
              resolve(res);
            }
        })
    })
  }
}
exports.default = Friends;