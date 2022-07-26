import React from 'react';
import Login from './Login';
import Signin from './Signin';
import PagePrincipale from './PagePrincipale';
import PageProfil from './PageProfil';
import '../CSS/navPanel.css';
class NavigationPanel extends React.Component {
    
  render() {
    const { 
      login, 
      logout, 
      signup, 
      getPageProfil, 
      getPagePrincipale, 
      isConnected, 
      currentPage, 
      username, 
      password,
      handleLogin,
      handlePassword,
      user_id,
      setUser_id,
      getPageProfilLink,
      userprofil,
      idprofil,
      reset
    } = this.props;
    if(currentPage !== "signup"){
      return <nav className="navPanel">
        {(isConnected !== false )
          ?( (currentPage === 'page principale')
            ?<PagePrincipale 
              logout = {logout}
              getPageProfil={() => {getPageProfil(username,username)}}
              user_id = {user_id}
              getPageProfilLink = {getPageProfilLink}
            />
            :<PageProfil 
              getPagePrincipale={getPagePrincipale}
              logout = {logout}
              username = {username}
              user_id = {user_id}
              getPageProfilLink = {getPageProfilLink}
              userprofil = {userprofil}
              idprofil = {idprofil}
              reset = {reset}
            /> )
          : <Login 
              login={login} 
              username={username} 
              password={password} 
              handleLogin = {handleLogin}
              handlePassword = {handlePassword}
              setUser_id = {setUser_id}
            />
        }

        {!isConnected && <p><b>Inscription </b>
          Pas encore de compte ?
          <button className="sign" onClick={() => { signup(); }}>S'inscrire</button>
        </p>}
      </nav>
    }else{
      return <nav id="navPanel">
        <Signin logout={logout} />
      </nav>
    }
  }
}
export default NavigationPanel;