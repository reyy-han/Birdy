import React from 'react';
import Logout from './Logout';
import logo_perroquet from '../images/perroquetr.png';
import '../CSS/pageprincipale.css';
import axios from 'axios';
import ListMessageUser from './ListMessageUser';
import ListMessageFriend from './ListMessageFriend';
import ListFriend from './ListFriend';
import Friendship from './Friendship';
import SearchLogin from './SearchLogin';
class PageProfil extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            lastname : "",
            firstname : "",
        }
    }

    componentDidMount(){
        const api = axios.create({
            baseURL : '/api/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        
        const {idprofil} = this.props
        api.get(`/user/${idprofil}`)
        .then(res => {
            console.log(res);
            console.log(res.data);
            this.setState({lastname: res.data.lastname, firstname: res.data.firstname, change:false})
        })
        .catch(error =>{
            //alert(`Quelque chose c'est mal passé: n'arrive pas à accéder à l'utilisateur ${idprofil}`)
            console.log(error)
        })  
    }

    componentDidUpdate(prevProps){
        if(this.props.idprofil !== prevProps.idprofil){
            this.componentDidMount();
        }
    }

    deleteMyAccount = event =>{
        var res = window.confirm("Etes-vous sûr de vouloir supprimer votre compte? Vous perdrez tous vos messages et liens d'amitié.");
        if(res){
            const api = axios.create({
                baseURL : '/api',
                timeout : 1000,
                headers : {'X-Custom-Header' : 'foobar'}
            }); 
        
            event.preventDefault();
            api.delete(`/user/${this.props.user_id}`)
            .then(res => {
                this.setState({lastname:"", firstname: ""});
                this.props.reset();
                this.props.logout();
                console.log(res);
            })
            .catch(error =>{
                alert("probleme avec la suppression de compte")
                console.log(error)
            })  
        }else{

        }
    }

    

    render(){
        const {logout, getPagePrincipale,
             username, user_id, userprofil,
             idprofil, getPageProfilLink} = this.props;
        return <main>
            <header className="header">
                <div className='h'>
                    <aside className = "logo">
                        <img src={logo_perroquet}  className="logo_perroquet" alt="logo_bird" />
                    </aside>
                    <SearchLogin getPageProfilLink={getPageProfilLink} />
                    <div className='lien'>
                        <ul className="deux_boutons">
                            <li><section className="profil">
                            <button className = 'Button_page' onClick={ getPagePrincipale }> Retour </button>
                            </section></li>
                            <br></br><br></br><br></br>
                            <li><section className="deconnexion"><Logout logout={logout} /></section></li>
                        </ul>
                    </div>
                </div>        
            </header>
            <div className = "content">
                <div className = "friends">
                    <aside id="liste_friends">
                        {(user_id - idprofil) !== 0
                        ?<Friendship 
                                user_id = {user_id}
                                idprofil = {idprofil}
                                login_to = {userprofil}
                            />
                        : <div> 
                          <button className = "deletecompte" onClick={this.deleteMyAccount}><em>Supprimer mon compte</em></button>
                          </div>
                        }
                        <h5 className="limessage2" >Liste d'amis</h5>
                        <ListFriend 
                            user_id = {user_id}
                            idprofil = {idprofil}/>
                    </aside>
                </div>
                <div className="messages-content">
                    <address>
                        <p className="Information_top"><b>Connected</b> @{username} (id_{user_id}) </p>
                        <p className="Information"><b>Login</b> @{userprofil}</p>
                        <p className="Information"><b>id</b> @{idprofil}</p>
                        <p className="Information"><b>FirstName</b> {this.state.firstname} </p>
                        <p className="Information"><b>LastName</b> {this.state.lastname} </p>
                    </address>
                    <div className="message_user">
                        <h5 className="limessage">Messages postés par @{userprofil}</h5>
                        <ListMessageUser className="listmessagesprofil" 
                            getPageProfil={getPageProfilLink} 
                            idprofil = {idprofil}
                            user_id={user_id} 
                        />
                    </div>
                    <div className="message_friend">
                        <h5 className="limessage">Messages postés par les amis de @{userprofil}</h5>
                        <ListMessageFriend className="listmessagesprofil" 
                            getPageProfil={getPageProfilLink} 
                            idprofil = {idprofil}
                            user_id={user_id} 
                        />
                    </div>
                </div>
            </div>
            <footer></footer>
        </main>;
    }

}
export default PageProfil;