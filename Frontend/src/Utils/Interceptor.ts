import axios from "axios";

class Interceptor {
    public registerInterceptor(): void {
        axios.interceptors.request.use(request => {

            const token = sessionStorage.getItem("token")

            request.headers.Authorization = "Bearer " + token

            return request;
        });
    }
}

export const interceptor = new Interceptor();