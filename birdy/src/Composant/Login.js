import React from 'react';
import '../CSS/login.css';
import axios from 'axios';
class Login extends React.Component {
    
    handleChangeLogin = event =>{
        this.props.handleLogin(event.target.value);
    }
    handleChangePassword = event =>{
        this.props.handlePassword(event.target.value);
    }

    
    handleSubmit = event =>{
        const api = axios.create({
            baseURL : '/api/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        event.preventDefault();
        
        api.post("/user/login",{login:this.props.username, password: this.props.password})
        .then(res => {
            console.log(res)
            this.props.setUser_id(res.data.id);
            this.response_login(res);
        })
        .catch(error =>{
            alert("Login ou mot de passe incorrect : Il n'existe pas d'utilisateur à ce nom... Inscris-toi et reviens me voir:))")
            console.log(error)
        })  
    }
    response_login(response){
        const {login} = this.props;
        if(response.data["status"]==="error"){
            console.log(response.data["description"])
            this.setState({status:"error", texterror:response.data["description"]})
        }else{
            this.setState({status:""});
            login();
        }
    }

    render(){
        
        return <div className="LoginForm">
            <h2>Connexion</h2>
            <form className="log" onSubmit={this.handleSubmit}>Connecte-toi pour plus de fun!
                <section className="identification_forms">
                   <div>
                        <p className="cases">
                            <label className="labellogin" htmlFor="uname"><b>Login : </b></label>
                            <br></br>
                            <input className="input_log" type="text" placeholder="Enter Login" name="uname" onChange={this.handleChangeLogin} required/>
                        </p>
                        <p className="cases">
                            <label className="labellogin" htmlFor="psw"><b>Password : </b></label>
                            <br></br><input className="input_log" type="password" placeholder="Enter Password" name="psw"  onChange={this.handleChangePassword} required/>
                        </p>
                       
                   </div>
               </section>
                <button className="login" type="submit" >Se connecter</button>
            </form>
        </div>;
    }
}
export default Login;