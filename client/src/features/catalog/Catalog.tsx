import { useEffect } from "react";
import LoadinComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";

export default function Catalog() {

    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const {productsLoaded, status} = useAppSelector(state => state.catalog);


    useEffect(() => {
        if(!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch],)

    if(status.includes('pending')) return <LoadinComponent message='Loading products...'/>

    return (
        <>
            <ProductList products={products} />
        </>
    )
}