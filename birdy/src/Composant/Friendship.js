import React from 'react';
import '../CSS/pageprincipale.css';
import axios from 'axios';
class Friendship extends React.Component {
    constructor(props){
        super(props);
        this.state={
            friend: "friend",
            to_id:"",
            login_to: this.props.login_to,
            user_id: this.props.user_id
        }
    }
    componentDidMount(){
        const apifriends = axios.create({
            baseURL : '/apifriends/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        
        const {user_id, idprofil} = this.props
        apifriends.get(`/user/${user_id}/friends/${idprofil}`)
        .then(res => {
            console.log(res)
            this.setState({friend: res.data.login, to_id: res.data.to_id})
        })
        .catch(error =>{
            this.setState({friend: false})
            console.log(error)
        })  
    }

    handleOnClickFollow = event =>{
       
        const apifriends = axios.create({
            baseURL : '/apifriends/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        }); 
        
        event.preventDefault();
        apifriends.post(`/user/${this.props.user_id}/friends`, {login: this.props.login_to})
        .then(res => {
            console.log(res);
            alert("nouvelle amitié");
        })
        .catch(error =>{
            alert("probleme avec bouton follow");
            console.log(error);
        })  
    }

    handleOnClickUnfollow = event =>{
        var res = window.confirm(`Êtes-vous sûr de ne plus vouloir suivre ${this.props.login_to}?`);
        if(res){
            const apifriends = axios.create({
                baseURL : '/apifriends/',
                timeout : 1000,
                headers : {'X-Custom-Header' : 'foobar'}
            }); 
            
            event.preventDefault();
            apifriends.delete(`/user/${this.props.user_id}/friends/${this.props.to_id}`)
            .then(res => {
                console.log(res)
                this.setState({friend: false, to_id: ""})
            })
            .catch(error =>{
                alert("probleme avec bouton unfollow")
                console.log(error)
            })  
        }else{
            event.preventDefault();
        }
    }

    render(){
        const {user_id, idprofil, login_to } = this.props;
        
        return <form className="friendship"> 
            
            {(user_id - idprofil)===0
            ?<button className="button_of_friendship">unfollow</button>
            : (this.state.friend !== false
                ? <button className="button_of_friendship" onClick={this.handleOnClickUnfollow}>unfollow {this.state.friend}</button>
                :<button className="button_of_friendship" onClick={this.handleOnClickFollow}>follow {login_to}</button>)
            }   
        </form>
    }
}
export default Friendship;
