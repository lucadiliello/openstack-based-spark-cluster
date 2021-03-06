import React, {Component} from 'react';
import { Button, Form, Message, Header, Icon, Label} from 'semantic-ui-react';
import axios from 'axios';
import config from '../../Config.json';
import './Login.css';
import { Link } from 'react-router-dom';


class Login extends Component {

    state = {
        message: "",
        username: "",
        password: "",
        isLoading: false,
        error: false,
        registered: false
    }

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormReady = this.isFormReady.bind(this);
    }

    handleSubmit(){
        this.setState({
            ...this.state,
            isLoading: true
        }, () => {
            axios.post('/api/login', {
                username: this.state.username,
                password: this.state.password
            })
            .then(res => {
                let result = res.data;
                switch (result.status) {
                    case "OK":
                        this.setState({
                            ...this.state,
                            isLoading: false
                        }, () => this.props.setToken(result.token));
                        break;
                    case "MALFORMED_JSON":
                    case "MISSING_PARAMS":
                    case "WRONG_AUTH_PARAMS":
                    default:
                        this.setState({
                            ...this.state,
                            message: result.message,
                            error: true,
                            isLoading: false
                        }, () => setTimeout(() => {
                            this.setState({
                                ...this.state,
                                message: undefined,
                                error: false,
                            });
                        }, 3000));
                        break;
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    ...this.state,
                    message: "Connection Error",
                    error: true,
                    isLoading: false
                }, () => setTimeout(() => {
                    this.setState({
                        ...this.state,
                        message: undefined,
                        error: false,
                    });
                }, 3000));
            });
        })
    }

    isFormReady(){
        return (this.state.username.length > 3) && (this.state.password.length > 7)
    }

    render() {
        return <div className="containerLogin">
            <div className="middleDiv">
                <Header inverted size='huge'>
                    {config.project_name}
                    <Header.Subheader>
                        Login into your account or <Label as={Link} to={'/registration'} className='navText'>Register</Label>
                    </Header.Subheader>
                </Header>
                <Form error={this.state.error} onSubmit={this.handleSubmit}>
                    <Message
                        error
                        header={'Login Error'}
                        content={this.state.message}
                        className='errMessage'
                    />   
                    <Form.Input 
                        fluid icon='user' iconPosition='left' 
                        placeholder='Username' type='text'
                        value={this.state.username}
                        onChange={(e) => this.setState({...this.state, username: e.target.value})}
                        size='big'
                        onKeyPress={(e) => (e.key === 'Enter') && this.isFormReady() ? this.handleSubmit() : null}/>

                    <Form.Input 
                        fluid icon='lock' iconPosition='left' 
                        placeholder='Password' type='password'
                        value={this.state.password}
                        onChange={(e) => this.setState({ ...this.state, password: e.target.value })}
                        size='big'
                        onKeyPress={(e) => (e.key === 'Enter') && this.isFormReady() ? this.handleSubmit() : null} />
                </Form>
                <Button
                    basic inverted animated={!this.state.isLoading}
                    loading={this.state.isLoading} onClick={this.handleSubmit}
                    floated='right' size='large' className='loginButton'
                    disabled={!this.isFormReady()}
                >
                    <Button.Content visible>Login</Button.Content>
                    <Button.Content hidden>
                        <Icon name='right arrow' />
                    </Button.Content>
                </Button>                
            </div>
        </div>
    }
}

export default Login;