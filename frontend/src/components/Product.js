import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {Link, useNavigate} from 'react-router-dom';
import Rating from './Rating';
import axios from "axios";
import {useContext} from "react";
import {Store} from "../Store";

function Product(props) {
    const navigate = useNavigate();
    const { product } = props;

    const { state, dispatch: ctxDispatch } = useContext(Store);

    const {
        cart: { cartItems },
    } = state;

    const updateCardHandler = async (item) =>{

        debugger



        const existItem = cartItems.find((x)=>x._id === product._id);
        const quantity = existItem ? existItem + 1 : 1;

        const {data} = await axios.get(`/api/products/${product._id}`);

        if(data.countInStock < quantity){
            window.alert('Sorry. Product os put pf stock');
            return
        }

        ctxDispatch({
            type:'CART_ADD_ITEM',
            payload: { ...product, quantity: 1 },
        });
    };

    return (
        <Card>
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} className="card-img-top" alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <Card.Text>${product.price}</Card.Text>
                <Button onClick={()=>updateCardHandler(product)}>Add to cart</Button>
            </Card.Body>
        </Card>

    );
}
export default Product;