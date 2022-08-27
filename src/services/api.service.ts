import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_PATH, REFRESH_TOKEN_URL } from "../api/endpoints";
import { eventBus } from "../utils";
import { getAccessToken, getRefreshToken, setAccessToken } from "./storage.service";

const instance = axios.create({
    baseURL: BASE_PATH,
});

instance.interceptors.request.use(
    function (config: AxiosRequestConfig) {

        const accessToken = getAccessToken();

        if (accessToken)
            config.headers!.Authorization = 'Bearer ' + accessToken;

        return config;
    },
    function (error: any) {
        console.log("error in request interceptor: ", error);
        return error;
    }
);

instance.interceptors.response.use(
    function (response: AxiosResponse) {
        return response;
    },
    async function (error) {

        let errorMessage = '';

        if (error.response) {

            const { data, status, statusText } = error.response;

            if (error.message === "Network Error") {

                errorMessage = 'Unable to connect to server';
                // console.log(error);

            } else {

                switch (status) {
                    case 0: {
                        errorMessage = 'Unable To Connect';
                        break;
                    }
                    case 400: {
                        errorMessage = data || statusText || 'Bad Request';
                        break;
                    }
                    case 401: {

                        const originalRequest = error.config;

                        if(originalRequest.url !== REFRESH_TOKEN_URL && !originalRequest.retryRequest){

                            originalRequest.retryRequest = true;

                            try{

                                const refreshTokenReq = await instance.post(REFRESH_TOKEN_URL, {
                                    refreshToken: getRefreshToken()
                                });

                                const { accessToken } = refreshTokenReq.data;

                                setAccessToken(accessToken);

                                return instance(originalRequest);

                            }catch(e){
                                return Promise.reject(e);
                            }

                        }

                        errorMessage = data || statusText || 'Unauthorized Access';

                        //Clean User state and logout
                        eventBus.dispatch('logout');

                        break;
                    }
                    case 403: {
                        errorMessage = data || statusText || 'Forbidden';
                        break;
                    }
                    case 404: {
                        errorMessage = data || statusText || 'Requested Resource Not Found';
                        break;
                    }
                    case 500: {
                        errorMessage = data || statusText || 'Internal Server Error';
                        break;
                    }
                    default: {
                        errorMessage = `Error Code: ${status}. Unknown Error`;
                    }
                }
            }

        } else {
            errorMessage = error.toJSON().message;
        }

        return Promise.reject(errorMessage);
    }
);

export default instance;