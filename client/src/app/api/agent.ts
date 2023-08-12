import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../Router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";
axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

const sleep = () => new Promise(resolve => setTimeout(resolve, 400));
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep();
    const pagination = response.headers['pagination'];
    if (pagination) {
        const paginatedResponse = new PaginatedResponse(response.data, JSON.parse(pagination));
        response.data = paginatedResponse;
        return response;
    }
    return response;
}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:
            router.navigate('/server-error', { state: { error: data } });
            break;
        default:
            break
    }
    return Promise.reject(error.response);
});

const request = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Catalog = {
    list: (params: URLSearchParams) => request.get('products', params),
    details: (id: number) => request.get(`products/${id}`),
    fetchFilters: () => request.get('products/filters')
}

const TestErrors = {
    get400Error: () => request.get('buggy/bad-request'),
    get401Error: () => request.get('buggy/unauthorized'),
    get404Error: () => request.get('buggy/not-found'),
    get500Error: () => request.get('buggy/server-error'),
    getValidationError: () => request.get('buggy/validation-error')
}

const Basket = {
    get: () => request.get('basket'),
    addItem: (productId: number, quantity = 1) => request.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => request.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const Account = {
    login: (values: any) => request.post('account/login', values),
    register: (values: any) => request.post('account/register', values),
    currentUser: () => request.get('account/currentUser'),
    fetchAddress: () => request.get('account/savedAddress')
}

const Orders = {
    list: () => request.get('orders'),
    fetch: (id: number) => request.get(`orders/${id}`),
    create: (values: any) => request.post('orders', values)
}

const Payments = {
    createPaymenyIntent: () => request.post('payment', {})
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payments
}

export default agent;