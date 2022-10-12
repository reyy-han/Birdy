import React from 'react';
import '../CSS/pageprincipale.css';
import Message from './Message';
import axios from 'axios';
class ListMessages extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            messages: "messages",
            change : false,
            right : true
        }
        this.DidChangeMessage = this.DidChangeMessage.bind(this);
    }
    componentDidMount(){
        const apimessages = axios.create({
            baseURL : '/apimessages/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        
        apimessages.get(`/messages`)
        .then(res => {
            console.log(res)            
            this.setState({messages: res.data, change: false})
        })
        .catch(error =>{
            //alert("Quelque chose c'est mal passé list messages")
            console.log(error)
        })  
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.change !== false){
            this.componentDidMount();
        }
    }
   
    DidChangeMessage (){
        this.setState({change:true});
    }

    render(){
        const {user_id, getPageProfil} = this.props;
        return <div className="listmessages">
            {Object.prototype.toString.apply(this.state.messages) === "[object Array]"
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
                :<p>Aucun message n'a été posté pour l'instant</p>
            }
        </div>
    }
}
export default ListMessages;
