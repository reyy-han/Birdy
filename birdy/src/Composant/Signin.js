import React from 'react';
import '../CSS/signin.css';
import axios from 'axios';
class Signin extends React.Component {
    constructor(props){
        super(props);
        this.state={
            login:"",
            password:"",
            confirmpassword:"",
            firstname:"",
            lastname:"",
            email:"",
        }
    }
    handleChangeLogin = event =>{
        this.setState({login: event.target.value});
    }
    handleChangePassword = event =>{
        this.setState({password: event.target.value});
    }
    handleChangeConfirmPassword = event =>{
        this.setState({confirmpassword: event.target.value});
    }
    handleChangeFirstname = event =>{
        this.setState({firstname: event.target.value});
    }
    handleChangeLastname = event =>{
        this.setState({lastname: event.target.value});
    }
    handleChangeEmail = event =>{
        this.setState({email: event.target.value});
    }
    
    handleSubmit = event =>{
        const api = axios.create({
            baseURL : '/api/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        event.preventDefault();
        api.post("/user",{login:this.state.login, password: this.state.password, confirmpassword:this.state.confirmpassword, lastname:this.state.lastname, firstname:this.state.firstname})
        .then(res => {
            console.log(res)
            console.log(res.data)
            this.response_login(res)
        })
        .catch(error =>{
            alert("Il y a un problème...(soit login déjà utilisée, soit mot de passe incorrect)")
            console.log(error)
        })  
    }
    response_login(response){
        const {logout} = this.props;
        if(response.data["status"]==="error"){
            console.log(response.data["description"])
            this.setState({status:"error", texterror:response.data["description"]})
        }else{
            this.setState({status:""});
            logout();
        }
    }
    render() {
        return <div className = "Enregistrement">
            <h2>Rejoins-nous!</h2>
            <form className="e" onSubmit={this.handleSubmit}>
               <section className="enregistrement_forms">
                   <p className = "i">
                        <p className="namealign">
                           <p className="align">
                               <label className="labels" for="uname"><b>Prenom : </b></label>
                                <input className="input_name" type="text" placeholder="Entre ton prenom" name="uname" onChange={this.handleChangeFirstname} required/>
                            </p>
                            <p className="align">
                                <label className="label_nom"  for="uname"><b>Nom : </b></label>
                                <input className="input_name" type="text" placeholder="Entre ton nom" name="uname" onChange={this.handleChangeLastname} required/>
                            </p>
                            
                        </p>
                   </p>
                   <p className = "i">
                    <label className="labels" for="uname"><b>Login : </b></label>
                    <input className="input_sign" type="text" placeholder="Entre ton login" name="uname" onChange={this.handleChangeLogin} required/>
                   </p>
                   <p className = "i">
                    <label className="labels" for="email"><b>Email : </b></label>
                    <input className="input_sign" type="email" placeholder="Entre ton email" name="email" onChange={this.handleChangeEmail} required/>
                   </p>
                   <p className = "i">
                    <label className="labels" for="psw"><b>Mot de Passe (au moins 8 caractères): </b></label>
                    <input className="input_sign" type="password" placeholder="Entre ton mot de passe" name="psw" minLength="8" pattern="[0-9a-zA-Z]{8,16}" onChange={this.handleChangePassword} required/>
                   </p>
                   <p className = "i">
                    <label className="labels" for="psw"><b>Confirmation Mot de passe : </b></label>
                    <input className="input_sign" type="password" placeholder="Entre de nouveau ton mot de passe" name="psw" onChange={this.handleChangeConfirmPassword} minlength="8" pattern="[0-9a-zA-Z]{8,16}" required/>
                   </p>
               </section>
               <section>
                   <button className="enregistrement_button" type="submit">Subscribe!</button>
               </section>
            </form>
        </div>
      }
}
export default Signin;