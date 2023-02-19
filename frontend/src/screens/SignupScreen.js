import { Link, useLocation,useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import {useContext, useEffect, useState} from "react";
import Axios from 'axios';
import {Store} from "../Store";
import {toast} from 'react-toastify';
import {getError} from "../utils";

export default function SignupScreen() {
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    const navigate = useNavigate();

    const {state,dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;



    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');


    const submitHandler = async (e) => {
        e.preventDefault();

        debugger

        if(confirmPassword !== password) {
            toast.error('Passwords do not match');
            return
        }

        e.preventDefault();
        try {
            const { data } = await Axios.post('/api/users/signup', {
                name,
                email,
                password,
            });

            ctxDispatch({type:"USER_SIGNIN",payload : data});
            localStorage.setItem('userInfo',JSON.stringify(data));

            debugger

            navigate(redirect || '/');

            console.log(data);
            // ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            // localStorage.setItem('userInfo', JSON.stringify(data));
            // navigate(redirect || '/');
        } catch (err) {
            toast.error(getError(err))
            // toast.error(getError(err));
        }
    };

    debugger

    useEffect(()=>{

        debugger
        if(userInfo){
            navigate(redirect);
        }

    });

    return (
        <Container className="small-container">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className="my-3">Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="name"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Sign Up</Button>
                </div>
                <div className="mb-3">
                    Already have an account??{' '}
                    <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                </div>
            </Form>
        </Container>
    );
}