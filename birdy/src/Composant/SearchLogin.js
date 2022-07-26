import React from 'react';
import '../CSS/pageprincipale.css';
import loupe from '../images/loupe.png';
import axios from 'axios';
class SearchLogin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            search_login : "",
            search_id : "" ,
            lastname: "",
            firstname: ""
        }
    }

    handleChangeLogin = event => {
        this.setState({ search_id : event.target.value});            
    }

    handleSendLogin = event => {
        const api = axios.create({
            baseURL : '/api/',
            timeout : 1000,
            headers : {'X-Custom-Header' : 'foobar'}
        });
        event.preventDefault();
        api.get(`/user/${this.state.search_id}`)
        .then(res => {
            this.setState({lastname: res.data.lastname, firstname: res.data.firstname})
            this.props.getPageProfilLink(res.data.login, this.state.search_id);
            console.log(res);
        })
        .catch(error =>{
            alert(`Probablement aucun utilisateur à cet Id n'existe`)
            console.log(error)
        })   
    }

    render(){

        return <div className="search_login">
            <form className="search" onSubmit={this.handleSendLogin}>
                <input className="search_input" type="search" id="search-people" placeholder="Cherche une personne en entrant son id" name="q" onChange={this.handleChangeLogin} aria-label="Search"/>
                <button className="search_button"><img src={loupe} className="loupe" alt="Search"/></button>
            </form>
        </div>
    }
}
export default SearchLogin;
