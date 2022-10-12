import React from 'react';
import '../CSS/pageprincipale.css';
import Message from './Message';
import axios from 'axios';
class ListMessageUser extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            messages: [],
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
        
        const {idprofil} = this.props
        apimessages.get(`/user/${idprofil}/messages`)
        .then(res => {
            console.log(res);
            this.setState({messages: res.data, change: false})
        })
        .catch(error =>{
            console.log(error)
        })  
    }
    
    componentDidUpdate(prevProps){
        if(this.state.change !== false){
            this.componentDidMount();
        }
        if(this.props.idprofil !== prevProps.idprofil){
            this.componentDidMount();
        }
    }
    
    DidChangeMessage (){
        this.setState({change:true});
    }

    render(){
        const {getPageProfil, user_id} = this.props;
        return <div className="listmessagesprofil">
            {
                this.state.messages.map((message,index) =>(
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
            }
        </div>
    }
}
export default ListMessageUser;
