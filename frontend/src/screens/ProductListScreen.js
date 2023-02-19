import React, {useContext, useEffect, useReducer} from 'react';
import logger from "use-reducer-logger";
import axios from "axios";
import {Store} from "../Store";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import Card from 'react-bootstrap/Card';
import Chart from "react-google-charts";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import { confirmAlert } from 'react-confirm-alert'; // Import
import { toast } from 'react-toastify';
import {getError} from "../utils";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':


            debugger

            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                loadingCreate: false,
            };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true,successDelete:false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                successDelete:true,
                loadingDelete: false,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false ,successDelete:false};
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false ,successDelete:false};
        default:
            return state;
    }
};


export default function ProductListScreen() {
    const navigate = useNavigate();
    const { search, pathname } = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;

    const [{loading,error,products,pages,loadingCreate,loadingDelete,successDelete },dispatch] = useReducer(logger(reducer),{
        loading:true,
        error:''
    });



    const {state,dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type:'FETCH_REQUEST'});
            try{
                const { data } = await axios.get(`/api/products/admin?page=${page} `, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({type:'FETCH_SUCCESS',payload: data});
            }catch(err){
                dispatch({type:'FETCH_FAIL',payload:err.message})
            }

            // setProducts(result.data);

        };


        debugger

        if(successDelete){
            dispatch({type:'DELETE_RESET'});
        }else{
            fetchData();
        }


    }, [userInfo,page,successDelete]);




    const createHandler =  () => {


        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async() => {

                        try {
                            dispatch({ type: 'CREATE_REQUEST' });
                            const { data } = await axios.post(
                                '/api/products',
                                {},
                                {
                                    headers: { Authorization: `Bearer ${userInfo.token}` },
                                }
                            );
                            toast.success('product created successfully');
                            dispatch({ type: 'CREATE_SUCCESS' });
                            navigate(`/admin/product/${data.product._id}`);
                        } catch (err) {
                            toast.error(getError(error));
                            dispatch({
                                type: 'CREATE_FAIL',
                            });
                        }


                    }
                },
                {
                    label: 'No',
                    onClick: () => alert('Click No')
                }
            ]
        });

        // setProducts(result.data);

    };

    const deleteProduct =  (idProduct) => {

        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async() => {

                        try {
                            dispatch({ type: 'DELETE_REQUEST' });
                            await axios.delete(`/api/products/${idProduct}`, {
                                headers: { Authorization: `Bearer ${userInfo.token}` },
                            });
                            toast.success('product deleted successfully');
                            dispatch({ type: 'DELETE_SUCCESS' });
                        } catch (err) {
                            toast.error(getError(error));
                            dispatch({
                                type: 'DELETE_FAIL',
                            });
                        }


                    }
                },
                {
                    label: 'No',
                }
            ]
        });

        debugger

    };



    return (
        <div>
            <Row>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="col text-end">
                    <div>
                        <Button type="button" onClick={createHandler}>
                            Create Product
                        </Button>
                    </div>
                </Col>
            </Row>

            {loadingCreate && <LoadingBox></LoadingBox>}
            {loadingDelete && <LoadingBox></LoadingBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products['products'].map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <Button variant="primary" size="sm" onClick={()=>navigate(`/admin/product/${product._id}`)}>
                                      Update
                                    </Button>
                                    <Button  type="button"
                                             variant="light" size="sm" onClick={()=>deleteProduct(product._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div>
                        {[...Array(products.pages).keys()].map((x) => (
                            <Link
                                key={x + 1}
                                className="mx-1"
                                to={`/admin/products?page=${x + 1}`}
                            >
                                <Button
                                    className={Number(products.page) === x + 1 ? "text-bold" : ""}
                                    variant="light"
                                >
                                    {x + 1}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}


