//管理员登录相关的API
import AxiosRequest from '@/utils/requests'

//登录方法
export function SignIn(body:Object){
    return AxiosRequest.post('/web/users/login',body,`headers:{
        'Content-Type':'application/json'
    }`)
}

//退出登录
export function SignOut(){
    return AxiosRequest.post('/web/users/logout')
}

//修改密码
export function changePwd(body:object){
    return AxiosRequest.put('/web/users/me',body)
}

//获取当前用户（管理员）信息
export function getUserProfile(){
    return AxiosRequest.get('/web/users/me')
}