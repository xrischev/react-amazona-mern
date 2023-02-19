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


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            var summaryChart = [['Category', 'Products']];

            action.payload.dailyOrders.forEach((dailyOrder)=>{
                let dailyArray = [
                    dailyOrder['_id'],
                    dailyOrder['orders'],
                ];

                summaryChart.push(dailyArray);

            });

            debugger

            action.payload['chartArray'] = summaryChart;

            return { ...state, summary: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


export default function DashboardScreen() {

    const [{loading,error,summary},dispatch] = useReducer(logger(reducer),{
        summary:'',
        loading:true,
        error:''
    });

    const {state,dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type:'FETCH_REQUEST'});
            try{
                const result = await axios.get('/api/orders/summary',
                    { headers: { Authorization: `Bearer ${userInfo.token}` } }
                    );
                dispatch({type:'FETCH_SUCCESS',payload: result.data});
            }catch(err){
                dispatch({type:'FETCH_FAIL',payload:err.message})
            }

            // setProducts(result.data);

        };
        fetchData();
    }, [userInfo]);




    debugger




    return (
        <div>
            <h1>Dashboard</h1>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <Row>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {summary.users && summary.users[0]
                                            ? summary.users[0].numUsers
                                            : 0}
                                    </Card.Title>
                                    <Card.Text> Users</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {summary.orders && summary.users[0]
                                            ? summary.orders[0].numOrders
                                            : 0}
                                    </Card.Title>
                                    <Card.Text> Orders</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        $
                                        {summary.orders && summary.users[0]
                                            ? summary.orders[0].totalSales.toFixed(2)
                                            : 0}
                                    </Card.Title>
                                    <Card.Text> Orders</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <div className="my-3">
                        <h2>Sales</h2>
                        {summary.dailyOrders.length === 0 ? (
                            <MessageBox>No Sale</MessageBox>
                        ) : (



                            <Chart
                                chartType="AreaChart"
                                width="100%"
                                height="400px"
                                data={summary['chartArray']}
                            />
                        )}
                    </div>
                    <div className="my-3">
                        <h2>Categories</h2>
                        {summary.productCategories.length === 0 ? (
                            <MessageBox>No Category</MessageBox>
                        ) : (
                            <div>
                                <Chart
                                    width="100%"
                                    height="400px"
                                    chartType="PieChart"
                                    loader={<div>Loading Chart...</div>}
                                    data={[
                                        ['Category', 'Products'],
                                        ...summary.productCategories.map((x) => [x._id, x.count]),
                                    ]}
                                ></Chart>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );

}