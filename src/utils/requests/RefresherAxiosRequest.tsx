import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

class RefresherAxiosRequest {
  private refresherAxiosInstance: AxiosInstance // 专门刷新token的axios实例
  public isRefreshing: boolean = false // 是否正在刷新token
  public temporaryQueue: Array<Promise<any>> = []; // 暂存队列,当处于刷新token的时间中时,后续请求全部push进该队列中

  constructor() {
    this.refresherAxiosInstance = axios.create({
      baseURL: 'http://113.44.47.220:8082',
      timeout: 5000
    })
    this.interceptorsRequest()
    this.interceptorsResponse()
  }

  // 请求拦截器
  private interceptorsRequest() {
    this.refresherAxiosInstance.interceptors.request.use((config) => {
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
  }

  // 响应拦截器
  private interceptorsResponse() {
    this.refresherAxiosInstance.interceptors.response.use((response) => {
      return response;
    }, async (error) => {
      if(error.response?.status){
        this.temporaryQueue = [];
        console.log('长token失效,跳转登录页面')
      }
    });
  }

  private request(axiosRequestConfig: AxiosRequestConfig): Promise<any> {
    return this.refresherAxiosInstance(axiosRequestConfig);
  }

  // 刷新短token的业务逻辑
  public async refresh(url: string = '/web/users/me/token', config: AxiosRequestConfig = {}): Promise<boolean> {
    try {
      const accessToken = localStorage.getItem('access_token')
      // const refreshToken = localStorage.getItem('refresh_token')
      this.isRefreshing = true; // 标记正在刷新token
      const { data, status } = await this.request({
        ...config,
        url,
        method: 'put',
        headers: {
          token:accessToken, // 把access_Token放到请求头里面(后台验证需要access_Token)
        },
      });
      Promise.allSettled(this.temporaryQueue)
      localStorage.setItem('access_token', data?.access_token);
      // localStorage.setItem('refresh_token', data?.refresh_token);
      return Promise.resolve(true);
    }
    catch (error) {
      console.warn('刷新token失败', error)
      return Promise.resolve(false);
    }
    finally {
      this.isRefreshing = false; // 标记刷新token完成
    }
  }
}

export default new RefresherAxiosRequest
