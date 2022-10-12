import React from 'react';
import '../CSS/pageprincipale.css';
import Friendship from './Friendship';
class Friend extends React.Component {
   

    render(){
        const { user_id, to_id, login_friend, timestamp } = this.props;
        let date = new Date(timestamp*1000);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let hour = date.getHours();
        let min = date.getMinutes();
        
        return <div className="friend">
            <b>@{login_friend}</b>  <em className="petit">(id_{to_id})   </em>
            {(user_id - to_id !== 0)
                ? <Friendship
                    user_id = {user_id}
                    idprofil = {to_id}
                    login_to = {login_friend}
                    to_id = {to_id}
                    />
                :  <p className="myself">yourself</p>
            }
            <em className="petit">since {day}.{month+1}.{year} {hour}:{min}</em>    
        </div>
    }
}
export default Friend;
