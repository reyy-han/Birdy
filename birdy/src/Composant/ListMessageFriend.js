import React from 'react';
import '../CSS/pageprincipale.css';
import Message from './Message';
import axios from 'axios';
class ListMessageFriend extends React.Component {
    constructor(props){
        super(props);
        this.state = { messages: "messages",
            change : false,
            right : false //indique que l'on aura pas le droit de modifier ou supprimer nos messages ici
        };
    }
    componentDidMount(){
        const apimessages = axios.create({
            baseURL : '/apimessages/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        
        const {idprofil} = this.props
        apimessages.get(`/user/${idprofil}/messages/friends`)
        .then(res => {
            console.log(res)
            this.setState({messages: res.data});
            this.response_did_mount(res);
        })
        .catch(error =>{
            console.log(error)
        })  
    }
    
    response_did_mount(response){
        if(response.data["status"]==="error"){
            console.log(response.data["description"])
            this.setState({status:"error", texterror:response.data["description"],messages: false})
        }else{
        this.setState({status:""});
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.idprofil !== prevProps.idprofil){
            this.componentDidMount();
        }
    }
    
    DidChangeMessage (){
        this.setState({change:true});
    }
    
    render(){
        const {idprofil,  user_id, getPageProfil} = this.props;
        
        return <div className="listmessagesprofil">
    
            {(this.state.messages !== `Aucun ami de l'utilisateur ${idprofil} n'a posté de message` && Object.prototype.toString.apply(this.state.messages) === "[object Array]")
            ?this.state.messages.map((message,index) =>(
                <Message 
                user_id = {user_id}
                idprofil={message.author_id} 
                userprofil={message.author_name} 
                text = {message.text}
                getPageProfil = {() => {getPageProfil(message.author_name,message.author_id)}}
                DidChangeMessage = {this.DidChangeMessage}

                right = {this.state.right}
            />
            ))
            :<b>Aucun message n'a été posté pour l'instant</b>
            }
        </div>
    }
}
export default ListMessageFriend;