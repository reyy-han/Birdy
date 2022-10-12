import React from 'react';
import '../CSS/pageprincipale.css';
import Friend from './Friend';
import axios from 'axios';
class ListFriend extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            friends: "friends"
        };
    }
    
    componentDidMount(){
        const apifriends = axios.create({
            baseURL : '/apifriends/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        
        const {idprofil} = this.props
        apifriends.get(`/user/${idprofil}/friends`)
        .then(res => {
            console.log(res)
            this.setState({friends: res.data})
        })
        .catch(error =>{
            console.log(error)
        })  
    }

    
    componentDidUpdate(prevProps){
        if(this.props.idprofil !== prevProps.idprofil){
            this.componentDidMount();
        }
    }

    render(){
        const { user_id } = this.props;
        return <div className="listfriends">
            {Object.prototype.toString.apply(this.state.friends) === "[object Array]"
                ?this.state.friends.map((friend,index) =>(
                    <Friend 
                        user_id = {user_id}
                        to_id = {friend.to_id}
                        login_friend = {friend.login}
                        timestamp = {friend.timestamp}
                    />
                ))
                :<p>Pas encore d'ami</p>
            }
        </div>
    }
}
export default ListFriend;