import React from 'react';
import NavigationPanel from './NavigationPanel';
import '../CSS/mainpage.css';
class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            currentPage : 'login', // valeurs possibles: 'login', 'messages', 'signin',
            isConnected : false ,
            username : "",
            password : "",
            user_id :"",
            userprofil: "",
            idprofil:"",
        };
        this.getConnected = this.getConnected.bind(this);
        this.setLogout = this.setLogout.bind(this);
        this.getPageProfil = this.getPageProfil.bind(this);
        this.getPagePrincipale = this.getPagePrincipale.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.setUser_id = this.setUser_id.bind(this);
        this.getPageProfilLink = this.getPageProfilLink.bind(this);
        this.resetAll = this.resetAll.bind(this);
    }


    render() {
        return <div className="MainPage">
            <h1 className= "birdy"> 
            <p className="letter_birdy">B</p><p className="letter_birdy">I</p><p className="letter_birdy">R</p><p className="letter_birdy">D</p><p className="letter_birdy">Y</p></h1>
            <NavigationPanel 
                login = {() => {this.getConnected()}} 
                logout = {() => {this.setLogout()} }  
                signup={() => { this.signup() }}
                getPageProfil={() => {this.getPageProfil(this.state.username, this.state.user_id)}}
                getPagePrincipale={() => {this.getPagePrincipale(this.state.username, this.state.user_id)}}
                isConnected = {this.state.isConnected} 
                currentPage = {this.state.currentPage}
                username = {this.state.username} 
                password = {this.state.password}
                handleLogin = {this.handleLogin}
                handlePassword = {this.handlePassword}
                user_id = {this.state.user_id}
                setUser_id = {this.setUser_id}
                getPageProfilLink = {this.getPageProfilLink}
                userprofil = {this.state.userprofil}
                idprofil = {this.state.idprofil}
                reset = {this.resetAll}
            /></div>
    }

    getPageProfil(username, userid) {
        this.setState({ 
            isConnected : true ,
            currentPage: 'page profil',
            idprofil: userid,
            userprofil: username
        });
    }

    
    getPageProfilLink(username, userid) {
        this.setState({ 
            isConnected : true ,
            currentPage: 'page profil',
            userprofil: username,
            idprofil: userid
        });
    }

    getPagePrincipale(username, userid) {
        this.setState({ 
            isConnected : true ,
            currentPage: 'page principale',

        });
    }

    getConnected = () => {
        this.setState({ 
            isConnected : true ,
            currentPage: 'page principale'
            
        });
    } 

    setLogout = () => {
        this.setState({ 
            isConnected : false, 
            currentPage: 'login',
        });
    }

    signup = () => {
        this.setState({ currentPage: 'signup' });
    }

      
    handleLogin(login){
        this.setState({username: login});
        this.setState({userprofil: login});
    }
    handlePassword(password){
        this.setState({password: password});
    }

    setUser_id(id){
        this.setState({user_id: id});
        this.setState({idprofil: id});
    }

    resetAll = () => {
        this.setState({ 
            username: "",
            password: "",
            user_id: "",
            userprofil: "",
            idprofil: ""
        });
    }
}
export default MainPage
