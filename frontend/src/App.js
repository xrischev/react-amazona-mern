import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import 'react-toastify/dist/ReactToastify.css';
import React, {useContext, useEffect, useState} from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {LinkContainer} from 'react-router-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import {Store} from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import NavDropdown from 'react-bootstrap/NavDropdown';
import {ToastContainer} from 'react-toastify';
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchBox from "./components/SearchBox";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {toast} from 'react-toastify';
import {getError} from "./utils";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoutes";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoutes from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import LandingPage from "./screens/LandingPage";
import OrdersScreen from "./screens/OrdersScreen";

function App() {
    const {state,dispatch:ctxDispatch} = useContext(Store);
    const {cart,userInfo} = state;


    debugger

    const signoutHandler = () => {
        ctxDispatch({type:'USER_SIGNOUT'});
        localStorage.removeItem('userInfo');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
    };



    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
    }, []);

    return (
       <BrowserRouter>
           <div className="d-flex flex-column site-container">
               <div  className={
                   sidebarIsOpen
                       ? 'd-flex flex-column site-container active-cont'
                       : 'd-flex flex-column site-container'
               }>

                   <ToastContainer position="bottom-center" limit={1}/>
                   <header>
                       <Navbar bg="dark" variant="dark">
                           <Container>
                               <Button
                                   variant="dark"
                                   onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                               >
                                   <i className="fas fa-bars"></i>
                               </Button>
                               <LinkContainer to="/">
                                   <Navbar.Brand>amazona</Navbar.Brand>
                               </LinkContainer>
                               <Navbar.Collapse id="basic-navbar-nav">
                                   <SearchBox />
                                   <Nav className="me-auto  w-100  justify-content-end">
                                       <Link to="/cart" className="nav-link">
                                           Cart
                                           {cart.cartItems.length > 0 && (
                                               <Badge pill bg="danger">
                                                   {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                                               </Badge>
                                           )}
                                       </Link>
                                       <Link to="/landing-page" className="nav-link">
                                         Landing page
                                       </Link>
                                       {userInfo ? (
                                           <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                                               <LinkContainer to="/profile">
                                                   <NavDropdown.Item>User Profile</NavDropdown.Item>
                                               </LinkContainer>
                                               <LinkContainer to="/orderhistory">
                                                   <NavDropdown.Item>Order History</NavDropdown.Item>
                                               </LinkContainer>
                                               <NavDropdown.Divider />
                                               <Link
                                                   className="dropdown-item"
                                                   to="#signout"
                                                   onClick={signoutHandler}
                                               >
                                                   Sign Out
                                               </Link>
                                           </NavDropdown>
                                       ) : (
                                           <Link className="nav-link" to="/signin">
                                               Sign In
                                           </Link>
                                       )}
                                       {userInfo && userInfo.isAdmin && (
                                           <NavDropdown title="Admin" id="admin-nav-dropdown">
                                               <LinkContainer to="/admin/dashboard">
                                                   <NavDropdown.Item>Dashboard</NavDropdown.Item>
                                               </LinkContainer>
                                               <LinkContainer to="/admin/products">
                                                   <NavDropdown.Item>Products</NavDropdown.Item>
                                               </LinkContainer>
                                               <LinkContainer to="/admin/orders">
                                                   <NavDropdown.Item>Orders</NavDropdown.Item>
                                               </LinkContainer>
                                               <LinkContainer to="/admin/users">
                                                   <NavDropdown.Item>Users</NavDropdown.Item>
                                               </LinkContainer>
                                           </NavDropdown>
                                       )}
                                   </Nav>
                               </Navbar.Collapse>
                           </Container>
                       </Navbar>

                   </header>

                   <div
                       className={
                           sidebarIsOpen
                               ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                               : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
                       }
                   >
                       <Nav className="flex-column text-white w-100 p-2">
                           <Nav.Item>
                               <strong>Categories</strong>
                           </Nav.Item>
                           {categories.map((category) => (
                               <Nav.Item key={category}>
                                   <LinkContainer
                                       to={{ pathname: '/search', search: `category=${category}` }}
                                       onClick={() => setSidebarIsOpen(false)}
                                   >
                                       <Nav.Link>{category}</Nav.Link>
                                   </LinkContainer>
                               </Nav.Item>
                           ))}
                       </Nav>
                   </div>


                   <main>

                       <Container>
                           <Routes>
                               <Route path="/product/:slug" element={<ProductScreen/>}/>
                               <Route path="/cart" element={<CartScreen/>}/>
                               <Route path="/search" element={<SearchScreen/>}/>
                               <Route path="/signin" element={<SigninScreen/>}/>
                               <Route path="/signup" element={<SignupScreen/>}/>
                               <Route path="/shipping" element={<ShippingAddressScreen/>}/>
                               <Route path="/payment" element={<PaymentMethodScreen/>}/>
                               <Route path="/placeorder" element={<PlaceOrderScreen />} />
                               <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>} />
                               <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
                               <Route path="/admin/products" element={<ProtectedRoute><ProductListScreen /></ProtectedRoute>} />
                               <Route path="/admin/product/:id" element={<ProtectedRoute><ProductEditScreen /></ProtectedRoute>} />
                               <Route path="/" element={<HomeScreen/>}/>
                               <Route path="/landing-page" element={<LandingPage/>}/>
                               <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen/></ProtectedRoute>}/>
                               <Route path="/admin/orders" element={<ProtectedRoute><OrdersScreen/></ProtectedRoute>}/>
                               {/*admin*/}
                               <Route path = "/admin/dashboard" element={<AdminRoutes><DashboardScreen></DashboardScreen></AdminRoutes>}></Route>
                           </Routes>
                       </Container>

                   </main>
                   <footer>
                       <div className="text-center">
                           All right reserved
                       </div>
                   </footer>
               </div>
           </div>
       </BrowserRouter>
    );
}

export default App