import { Link, useLocation,useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import {useContext, useEffect, useReducer, useState} from "react";
import axios from 'axios';
import {Store} from "../Store";
import {toast} from 'react-toastify';
import {getError} from "../utils";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state,  loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


export default function ProfileScreen() {

    const {state,dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;


    const [name,setName] = useState(userInfo.name);
    const [email,setEmail] = useState(userInfo.email);
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');


    const [{ loading, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const submitHandler = async (e) => {

        debugger

        e.preventDefault();
        try {


            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );

            debugger

            dispatch({
                type: 'UPDATE_SUCCESS',
            });

            ctxDispatch({type:"USER_SIGNIN",payload : data});
            localStorage.setItem('userInfo',JSON.stringify(data));

            toast.success('User updated successfully');

        } catch (err) {
            toast.error(getError(err))
            // toast.error(getError(err));
        }
    };

    return (
        <Container className="small-container">
            <Helmet>
                <title>Update Profile</title>
            </Helmet>
            <h1 className="my-3">Update Profile</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        value={name}
                        type="name"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        value={email}
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
                    <Button type="submit">Update</Button>
                </div>

            </Form>
        </Container>
    );
}