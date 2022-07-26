import React from 'react';
import '../CSS/pageprincipale.css';
class Logout extends React.Component {
    
    render(){
        const {logout} = this.props;
        return <div>
            <button className = 'Button_page' onClick={ logout }> Se déconnecter </button>
            </div>
    }
}
export default Logout;