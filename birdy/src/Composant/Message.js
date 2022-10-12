import React from 'react';
import '../CSS/pageprincipale.css';
import poubelle from '../images/poubelle.png';
import modif from '../images/modif.png';
import axios from 'axios';
class Message extends React.Component {
   constructor(props){
       super(props); 
       this.state = {
           display : 'none',
           new_message: this.props.text,
       }
   }

    masquer_afficher = event => {
        if(this.state.display === 'none'){
            this.setState({
                display : 'block',
            })
        }else{
            this.setState({
                display : 'none',
            })
        }
    }
    
    handleChangeText = event =>{
        this.setState({new_message: event.target.value});
    }

    handleOnClickModifie = event =>{
        const apimessages = axios.create({
            baseURL : '/apimessages',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        }); 
        
        event.preventDefault();
        apimessages.put(`/user/${this.props.user_id}/messages`,
            {old_message: this.props.text, new_message: this.state.new_message}
        )
        .then(res => {
            this.setState({old_message: this.state.new_message});
            this.props.DidChangeMessage();
            console.log(res);
        })
        .catch(error =>{
            alert("probleme avec bouton modifie message")
            console.log(error)
        })      
    }
    
    handleOnClickDelete = event =>{
        var res = window.confirm("Etes-vous sûr de vouloir supprimer ce message?");
        if(res){
            const apimessages = axios.create({
                baseURL : '/apimessages',
                timeout : 1000,
                headers : {'X-Custom-Header' : 'foobar'}
            }); 
        
            event.preventDefault();
            apimessages.delete(`/user/${this.props.user_id}/messages`, 
                {data:{message: this.props.text }})
            .then(res => {
                console.log(res);
                this.setState({new_message: ""});
                this.props.DidChangeMessage();
            })
            .catch(error =>{
                alert("probleme avec bouton supprime message")
                console.log(error)
            })  
        }else{

        }
    }

    componentDidUpdate(prevProps){
        if(this.state.old_message !== prevProps.old_message){
            this.render();
        }
        if(this.props.text !== prevProps.text){
            this.render();
        }
    }

    render(){
        const {text, getPageProfil, userprofil, idprofil, user_id, right} = this.props;
        
        return <div className="message">
            {(idprofil - user_id)===0 && right
              ?<div >
                <p className="sender">
                    <b>@<button className="button_login" onClick={() =>{getPageProfil(userprofil,idprofil) }}>{userprofil}</button>(id:{idprofil}) </b>
                    <button className="modif_msg" onClick={this.masquer_afficher}><img src={modif} className="modif" alt="Modifier"/></button>
                    <button className="delete" onClick={this.handleOnClickDelete}><img src={poubelle} className="suppr" alt="Supprimer"/></button>
                </p>
                <p className="textbox"> {text}</p>
                <div className="changehide" style={this.state}>
                    <form className="formchange" onSubmit= {this.handleOnClickModifie}>
                        <textarea className="text_msg" type="text" name="modif_message" maxLength="200" onChange={this.handleChangeText} value = {this.state.new_message}/>
                        <button className="put_nmsg" >Modifie</button>
                    </form>
                </div>
                </div>

              : <div >
                    <p className="sender">
                        <b>@<button className="button_login"  onClick={() =>{getPageProfil(userprofil,idprofil) }}>{userprofil}</button>(id:{idprofil}) </b>
                    </p>
                    <p className="textbox"> {text}</p>
                </div>
            } 
        </div>
    }
}
export default Message;
