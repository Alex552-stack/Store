import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import LoadinComponent from "../../app/layout/LoadingComponent";

const stripePromise = loadStripe('pk_test_51NcqHHF4OxSnGZxFYcCK86WKSg7G7mEKkTMHEj0RmhbXDOjK7DHOA6XKDOx5l8W260ZLv8pduRHvPUgaLI71p02z00Z3MPrzib')

export default function CheckoutWrapper() {

    const dispatch = useAppDispatch();
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymenyIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(`Asta e cacata de eroare ${error}`))
            .finally(() => setLoading(false))
    }, [dispatch])

    if(loading) return <LoadinComponent message = 'Loading checkout...'/>

    return (
        <Elements stripe = {stripePromise}>
            <CheckoutPage/>
        </Elements>
    )
}