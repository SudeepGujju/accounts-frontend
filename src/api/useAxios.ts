import { useContext, useMemo } from "react";
import { UserContext } from "../context";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_PATH } from "./endpoints";
import { useNavigate } from "react-router-dom";


const useAxios = () => {
  // const userCtx = useContext(UserContext);
  // const navigate = useNavigate();

  // const axiosInstance = useMemo(() => {

  //   const instance = axios.create({
  //     baseURL: BASE_PATH,
  //   });

  //   const tokenInterceptor = instance.interceptors.request.use(
  //     function (config: AxiosRequestConfig) {

  //       if (userCtx?.accessToken)
  //         config.headers!.Authorization = 'Bearer '+userCtx.accessToken;

  //       return config;
  //     },
  //     function (error: any) {
  //       console.log("error in request interceptor: ", error);

  //       return error;
  //     }
  //   );

  //   const errorInterceptor = instance.interceptors.response.use(
  //     function (response: AxiosResponse) {
  //       return response;
  //     },
  //     async function (error) {

  //       let errorMessage = '';

  //       if(error.response){

  //         const {data, status, statusText} = error.response;

  //         if(error.message === "Network Error"){

  //           errorMessage = 'Unable to connect to server';
  //           // console.log(error);

  //         }else{

  //             switch (status) {
  //                 case 0: {
  //                     errorMessage= 'Unable To Connect';
  //                     break;
  //                 }
  //                 case 400: {
  //                     errorMessage= data || statusText || 'Bad Request';
  //                     break;
  //                 }
  //                 case 401: {

  //                     errorMessage = data || statusText || 'Unauthorized Access';
                      
  //                     userCtx?.removeUser();
  //                     navigate('/login', {state: {backgroundLocation: null} });

  //                     break;
  //                 }
  //                 case 403: {
  //                     errorMessage= data || statusText || 'Forbidden';
  //                     break;
  //                 }
  //                 case 404: {
  //                     errorMessage= data || statusText || 'Requested Resource Not Found';
  //                     break;
  //                 }
  //                 case 500: {
  //                     errorMessage= data || statusText || 'Internal Server Error';
  //                     break;
  //                 }
  //                 default: {
  //                     errorMessage= `Error Code: ${status}. Unknown Error`;
  //                 }
  //             }
  //         }

  //       }else{
  //         errorMessage = error.toJSON().message;
  //       }

  //       return Promise.reject(errorMessage);
  //     }
  //   );

  //   return instance;
  // }, [userCtx, navigate]);

  // return axiosInstance;
};

export default useAxios;
