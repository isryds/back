import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import RefresherAxiosRequest from './RefresherAxiosRequest';
import { rejects } from 'assert';

type BaseResponse<T> = {
  data: T,
  status: string
}

class AxiosRequest {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://113.44.47.220:8082',
      timeout: 5000,
    })
    this.interceptorsRequest()
    this.interceptorsResponse()
  }

  // 请求拦截器
  private interceptorsRequest() {
    this.axiosInstance.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem("access_token")
      config.headers.token =accessToken;
      return config;
    }, function (error) { 
      return Promise.reject(error);
    });
  }

  // 响应拦截器
  private interceptorsResponse() {
    this.axiosInstance.interceptors.response.use((response) => {
      return response;
    }, async (error) => {
      // 当access_token超时时，调用刷新token的方法
      if(error.response?.status === '401' && await RefresherAxiosRequest.refresh('/web/users/me/token')){
        return Promise.reject(error); // 返回错误，可重发请求
      }
    });
  }

  async request<T>(axiosRequestConfig: AxiosRequestConfig): Promise<BaseResponse<T>> {
    // 当正在刷新token,将当前请求放入暂存队列中
    if (RefresherAxiosRequest.isRefreshing) {
      console.log('当前请求正在刷新token,暂存请求')
      return new Promise((resolve, reject) => {
        RefresherAxiosRequest.temporaryQueue.push(this.axiosInstance(axiosRequestConfig).then(res => {
          resolve({
            status: res.status.toString(),
            data: res.data,
          });
        }).catch(reject))// 最后会在promise.allSettled处执行
      })
    }
    return new Promise((resolve) => {
      this.axiosInstance(axiosRequestConfig).catch(() => {
        // 出现非200状态的错误,就重新发请求
        return this.request(axiosRequestConfig)
      }).then(res => {
        resolve({
          status: res?.status.toString(),
          data: res?.data,
        });
      })
    })
  }

  //基础请求方法
  async get<T>(url: string, config: AxiosRequestConfig = {},params?:Object): Promise<BaseResponse<T>> {
    const { data, status } = await this.request<T>({
      ...config,
      url,
      method: 'get',
      params:params
    });
    return { data, status };
  }

  async post<T>(url: string, body?: object, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const { data, status } = await this.request<T>({
      ...config,
      url,
      method: 'post',
      data: body,
    });
    return { data, status };
  }

  async put<T>(url: string, body: object, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const { data, status } = await this.request<T>({
      ...config,
      url,
      method: 'put',
      data:body
    });
    return { data, status };
  }

  async del<T>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const { data, status } = await this.request<T>({
      ...config,
      url,
      method: 'delete',
    });
    return { data, status };
  }
}

export default new AxiosRequest
