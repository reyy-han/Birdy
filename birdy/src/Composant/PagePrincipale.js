import React from 'react';
import Logout from './Logout';
import logo_perroquet from '../images/perroquetr.png';
import '../CSS/pageprincipale.css';
import NewMessage from './NewMessage';
import ListMessages from './ListMessages';
import SearchLogin from './SearchLogin';
import Statistiques from './Statistiques';
class PagePrincipale extends React.Component {
    

    render(add_message){
    const {logout,
        getPageProfil,
        user_id, 
        getPageProfilLink} = this.props;
        return <main>
            <header className="header">
                <div className='h'>
                    <aside className = "logo">
                        <img src={logo_perroquet}  className="logo_perroquet" alt="logo_bird" />
                    </aside>
                    <SearchLogin getPageProfilLink ={getPageProfilLink}/>
                    <div className='lien'>
                        <ul className="deux_boutons">
                            <li><section className="profil">
                                <button className = 'Button_page' onClick={ getPageProfil }> page profil </button></section></li>
                            <br></br><br></br><br></br>
                            <li><section className="deconnexion"><Logout logout={logout} /></section></li>
                        </ul>
                    </div>
                </div>        
            </header>
            <div className = "content">
                    <Statistiques
                        user_id = {user_id}
                    />
                <div className = "messages-content">
                    <div className="ecrire_message">
                       <NewMessage user_id={user_id} />
                    </div>
                    <div className="listes_messages">
                        <h4 className="limessage">Liste Messages</h4>
                        <ListMessages className="listmessages" 
                            user_id={user_id} 
                            getPageProfil={getPageProfilLink}                 
                        />
                    </div>
                </div>
            </div>
            <footer></footer>
        </main>;
    }
}
export default PagePrincipale;