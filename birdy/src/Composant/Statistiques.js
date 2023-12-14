import React from 'react';
import '../CSS/pageprincipale.css';
import axios from 'axios';
class Statistiques extends React.Component {
   constructor(props){
        super(props);
        this.state = {
            button_close_and_stats: {
                display: 'none'
            },
            button_open: {
                display: 'block'
            },
            display: 'none',
            count_users: "",
            count_messages : "",
            count_friendship: "",

            count_my_messages : "" ,
            count_I_follow: "",
            count_follow_me: "",

            most_famous_id: "",
            most_famous_login: "",
            nb_followed_by: "",
            count_follow_by_famous: "",
            count_famous_messages:""
        }
    }
    
    masquer_afficher = event => {
        if(this.state.button_close_and_stats.display === 'none'){
            this.setState({
                button_close_and_stats: {display : 'block'},
                button_open: {display : 'none'},
            })
        }else{
            this.setState({
                button_close_and_stats: {display : 'none'},
                button_open: {display : 'block'},
            })
        }
    }

    componentDidMount(){
        const apimessages = axios.create({
            baseURL : '/apimessages/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        const apifriends = axios.create({
            baseURL : '/apifriends/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        const api = axios.create({
            baseURL : '/api/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        
        apimessages.get(`/infos`)
        .then(res => {
            console.log(res)
            console.log(res.data)
            this.setState({count_messages: res.data.count_messages})
        })
        .catch(error =>{
            console.log(error)
        })  
        apimessages.get(`/user/${this.props.user_id}/infos`)
        .then(res => {
            console.log(res)
            console.log(res.data)
            this.setState({count_my_messages: res.data.count_my_messages})
        })
        .catch(error =>{
            console.log(error)
        })  

        
        apifriends.get(`/infos`)
        .then(res => {
            this.setState({
                count_friendship: res.data.count_friendship, 
                most_famous_id: res.data.most_famous,
                nb_followed_by: res.data.followed_by,
                most_famous_login: res.data.login,
                count_follow_by_famous: res.data.count_I_follow,
            })
            console.log(res)
            
            apimessages.get(`/user/${this.state.most_famous_id}/infos`)
            .then(res =>{
                console.log(res)
                console.log(res.data)
                this.setState({count_famous_messages: res.data.count_my_messages})
            })
        })
        .catch(error =>{
            console.log(error)
        })  
        apifriends.get(`/user/${this.props.user_id}/infos`)
        .then(res => {
            this.setState({
                count_I_follow: res.data.count_I_follow,
                count_follow_me: res.data.count_follow_me
            })
            console.log(res)
            console.log(res.data)
        })
        .catch(error =>{
            console.log(error)
        })  

        api.get(`/user/infos`)
        .then(res => {
            this.setState({
                count_users: res.data.count
            })
            console.log(res)
        })
        .catch(error =>{
            console.log(error)
        })  
    }

        
    
    render(){

        return <div className="statistiques">
            <div className='show_stats'>
            <button className="show_stats_button" style={this.state.button_open} onClick={this.masquer_afficher}>{">"}</button>
            <button className="hide_stats_button" style={this.state.button_close_and_stats} onClick={this.masquer_afficher}>{"<"}</button>
            </div>
            <div style={this.state.button_close_and_stats}>
                <div className="stats_div">
                    <h5 className="stats_title">About Myself!</h5>
                    <div className="enveloppe">
                        <p className="stats_info">{this.state.count_my_messages} messages postés</p>
                        <p className="stats_info">{this.state.count_follow_me} abonnés </p>
                        <p className="stats_info">{this.state.count_I_follow} abonnements</p>
                    </div>
                </div>
                <div className="stats_div">
                    <h5 className="stats_title">Most Famous!</h5>
                    <div className="enveloppe">
                        <p className="stats_info_famous"><b>{this.state.most_famous_login}</b></p>
                        <p className="stats_info">{this.state.nb_followed_by} abonnés </p>
                        <p className="stats_info">{this.state.count_follow_by_famous} abonnements</p>
                        <p className="stats_info">{this.state.count_famous_messages} messages postés</p>
                    </div>
                </div>
                <div className="stats_div">
                    <h5 className="stats_title">About Birdy!</h5>
                    <div className="enveloppe">
                        <p className="stats_info">{this.state.count_users} inscrits</p>
                        <p className="stats_info">{this.state.count_messages} messages postés</p>
                        <p className="stats_info">{this.state.count_friendship} amitiés</p>
                    </div>
                </div>
            </div>
            
        </div>
    }
}
export default Statistiques;
