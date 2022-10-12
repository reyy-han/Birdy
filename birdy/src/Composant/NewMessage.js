import React from 'react';
import '../CSS/pageprincipale.css';
import axios from 'axios';
class NewMessage extends React.Component {
    
    handleChangeMessage = event =>{
        this.setState({message: event.target.value});
    }
    
    handleSubmit = event =>{
        const api = axios.create({
            baseURL : '/apimessages/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        event.preventDefault();
        const {user_id} = this.props
        api.post(`/user/${user_id}/messages`,{message: this.state.message})
        .then(res => {
            console.log(res)
            this.response_login(res)
            alert("message posté!")
        })
        .catch(error =>{
            alert("Message non posté: Quelque chose c'est mal passé")
            console.log(error)
        })  
    }
    response_login(response){
        if(response.data["status"]==="error"){
            console.log(response.data["description"])
            this.setState({status:"error", texterror:response.data["description"]})
        }else{
            this.setState({status:""});
        }
    }

    render(){
        return <div className="newmessage">
            <form className="form_message" onSubmit={this.handleSubmit}>
                <p className="nmsg">
                    <label className="newmsg" htmlFor="uname"></label>
                    <textarea className="text_msg" type="text" placeholder="Poste un nouveau message" name="text_message" maxLength="200" onChange={this.handleChangeMessage} required/>
                    <button className = 'Button_post'> Post! </button>
                    </p>
            </form>
        </div>
    }
}
export default NewMessage;