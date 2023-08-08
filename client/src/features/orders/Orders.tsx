import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import LoadinComponent from "../../app/layout/LoadingComponent";
import { BasketItem } from "../../app/models/basket";
import { Order } from "../../app/models/order";
import { currencyFormat } from "../../app/util/util";
import BasketTable from "../basket/basketTable";

export default function Orders() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [showOrder, setShowOrder] = useState<boolean>(false);
    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        agent.Orders.list()
            .then(orders => setOrders(orders))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }, [])

    function handleClick(order: Order) {
        if (order) {
            setOrder(order);
            setShowOrder(!showOrder);
        }
    }

    if (loading) return <LoadinComponent message='Loading orders...' />
    if (!showOrder) {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order number</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Order Date</TableCell>
                            <TableCell align="right">Order Status</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders?.map((order) => (
                            <TableRow
                                key={order.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {order.id}
                                </TableCell>
                                <TableCell align="right">{currencyFormat(order.total)}</TableCell>
                                <TableCell align="right">{order.orderDate.split('T')[0]}</TableCell>
                                <TableCell align="right">{order.orderStatus}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => handleClick(order)}>View</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    else
        return (
            <>
                <Grid container>
                    <Grid item xs={11}>
                        <Typography variant="h4">
                            Order# {order?.id}- {order?.orderStatus}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Button onClick={() => setShowOrder(!showOrder)}>Return</Button>
                    </Grid>
                </Grid>

                <BasketTable items={order?.orderItems as BasketItem[]} isBasket={false} />
                <Grid container>
                    <Grid item xs={6} />
                    <Grid item xs={6}>
                        <TableContainer component={Paper} variant={'outlined'}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={2}>Subtotal</TableCell>
                                        <TableCell align="right">{currencyFormat(order?.subtotal!)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2}>Delivery fee*</TableCell>
                                        <TableCell align="right">{currencyFormat(order?.total! === order?.subtotal! ? 0 : 500)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2}>Total</TableCell>
                                        <TableCell align="right">{currencyFormat(order?.total!)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <span style={{ fontStyle: 'italic' }}>*Orders over $100 qualify for free delivery</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </>
        )
}