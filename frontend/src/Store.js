import {createContext, useReducer} from 'react';

export const Store = createContext();

const initialState = {
    userInfo:localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    cart: {
        shippingAddress:localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
        paymentMethod: localStorage.getItem('paymentMethod')
            ? JSON.parse(localStorage.getItem('paymentMethod'))
            : '',
        cartItems: localStorage.getItem('cardItem')
        ? JSON.parse(localStorage.getItem('cardItem'))
            : []
    },
};

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch};
    return <Store.Provider value={value}>{props.children} </Store.Provider>
}

function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_ITEM':

            debugger

            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            );
            const cartItems = existItem
                ? state.cart.cartItems.map((item) =>
                    item._id === existItem._id ? newItem : item
                )
                : [...state.cart.cartItems, newItem];

            localStorage.setItem('cardItem', JSON.stringify(cartItems));

            return { ...state, cart: { ...state.cart, cartItems } };

        case 'REMOVE_ITEM':

            let removedItemId = action.payload.item._id;

            const cartItemsRemoved = state.cart.cartItems.filter((item)=> item._id !== removedItemId);

            localStorage.setItem('cardItem', JSON.stringify(cartItemsRemoved));
            return {cart:{cartItems:cartItemsRemoved}};
        case 'CART_CLEAR':
            return {...state,cart:{
                    ...state.cart,cartItems:[]
                }};
        case 'USER_SIGNIN':
            return {...state,userInfo: action.payload};
        case 'USER_SIGNOUT':
            return {...state,userInfo:null,cart:{cartItems:[],shippingAddress:{},paymentMethod: ''}};
        case 'SAVE_SHIPPING_ADDRESS':
            return {...state,cart:{...state.cart,shippingAddress:action.payload}};
        case 'SAVE_PAYMENT_METHOD':
            return {...state,cart:{...state.cart,paymentMethod:action.payload}};
        default:
            return state;
    }
}