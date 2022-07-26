class Users {
  constructor(db) { 
    this.db = db;
    this.db.exec("CREATE TABLE IF NOT EXISTS users (login VARCHAR(512) NOT NULL UNIQUE, password VARCHAR(256) NOT NULL, lastname VARCHAR(256) NOT NULL, firstname VARCHAR(256) NOT NULL )");   
  }
  
  /**
   * Crée une entré dans la tables users avec les paramètres donnés
   * @param {*} login 
   * @param {*} password 
   * @param {*} lastname 
   * @param {*} firstname 
   * @returns le rowid de l'entrée créée
   */
  create(login, password, lastname, firstname){
    let _this = this
    return new Promise( (resolve, reject) =>{
        var stmt = _this.db.prepare("INSERT INTO users VALUES (?,?,?,?)");      
        stmt.run([login,password,lastname,firstname],function(err,res){
            if (err){
                reject(err);
            }else{
                resolve(this.lastID);
            }
        })
    })
  }

  /**
   * 
   * @returns Le nombre d'utilisateur total de la table users
   */
  number_users(){
    return new Promise( (resolve, reject) =>{
        var stmt = this.db.prepare("SELECT COUNT(rowid) as count FROM users ");      
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
   * @param {*} login 
   * @returns L'id de l'utilisateur ayant pour login login
   */
  getID(login){
    if(this.exists(login)){
      return new Promise((resolve,reject)=>{
        var stmt = this.db.prepare("SELECT rowid FROM users WHERE login = ?");
        stmt.get([login],function(err,res){
            if (err){
                reject(err);
            }else{
                resolve(res);
            }
        })
      })
    }  
  }

  /**
   * 
   * @param {*} user_id 
   * @returns Le login de l'utilisateur d'id user_id
   */
  getLogin(user_id){
    return new Promise((resolve,reject)=>{
      var stmt = this.db.prepare("SELECT login FROM users WHERE rowid = ?");
      stmt.get([user_id],function(err,res){
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
   * @param {*} userid 
   * @returns Les informations de l'utilisateur d'id userid
   */
  get(userid){
    return new Promise((resolve,reject)=>{
        var stmt = this.db.prepare("SELECT * FROM users WHERE rowid = ?");
        stmt.get([userid],function(err,res){
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
   * @param {*} login 
   * @returns Indique si un utilisateur avec le login donné existe dans la table users
   */
  async exists(login){
    return new Promise((resolve,reject)=>{
      var stmt = this.db.prepare("SELECT login FROM users WHERE login = ?");
      stmt.get([login],function(err,res){
        if (err){
          reject(err);
        }else{
          resolve(res !== undefined);
        }
      })
    })
  }
  
  /**
   * 
   * @param {*} login 
   * @param {*} password 
   * @returns Verifie que le login et le password existe ensemble dans la table users
   */
  async checkpassword (login, password){
    return new Promise((resolve,reject)=>{
      var stmt = this.db.prepare("SELECT rowid FROM users WHERE login = ? and password = ?");
      stmt.get([login, password],function(err,res){
        if (err){
          reject(err);
        }else{
          if(res == undefined){
            resolve(res)
          }else{
            let rowidJSON = JSON.stringify(res);
            let resparse = JSON.parse(rowidJSON);
            resolve(resparse.rowid);
          }
        }
      })
    })
  }
 
  /**
   * 
   * @param {*} login 
   * @returns Supprime l'utilisateur de login login
   */
  deleteUser(login){
    return new Promise((resolve,reject)=>{
      if(this.exists(login)){
        var stmt = this.db.prepare("DELETE FROM users WHERE login = ?");
        stmt.run([login], function(err,res){
          if(err){
            reject(err);
          }else{
            resolve(res);
          }
        })
      }
      else{
        var result = {
          "erreur":"utilisateur login n'existe pas"
        }
        reject(result);
      }
    });
  }
}
exports.default = Users;

