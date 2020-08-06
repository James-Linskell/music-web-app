import React from 'react';
import '../styles/ContactPage.css';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

class ContactPage extends React.Component {
    constructor() {
        super();
        this.state = {
            email: null
        }
        this.showEmail = this.showEmail.bind(this)
    }

    showEmail() {
        this.setState({email: <p className="Email"></p>});
    }

    render() {
        return (
            <div className="Contact">
                <div className="Contact-title">Contact</div>
                <p>Please use the links below to get in touch with any feedback or queries.</p>
                <p></p>
                <p></p>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                <div className="Socials">
                    <a href="https://www.linkedin.com/in/james-linskell-187382188" className="fa fa-linkedin"></a>
                    <a href="https://github.com/James-Linskell" className="fa fa-github"></a>
                    <a href="#" className="fa fa-email" onClick={this.showEmail}><MailOutlineIcon/></a>
                </div>
                {this.state.email}
            </div>
        )
    }
}

export default ContactPage;