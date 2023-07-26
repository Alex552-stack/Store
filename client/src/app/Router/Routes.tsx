import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetailes from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            children: [
                {path: '', element: <HomePage/>},
                {path: 'catalog', element: <Catalog/>},
                {path: 'catalog/:id', element: <ProductDetailes/>},
                {path: 'about', element: <AboutPage/>},
                {path: 'contact', element: <ContactPage/>}
            ]
        }
    ]
)