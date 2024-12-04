import AxiosRequest from '@/utils/requests'
import {AllUserResp} from '@/utils/ModuleProps/AppUsersItemsProp'
//APP用户信息

export interface AppUserProps extends Object {
    userId?:string,
    username?:string,
    isAdmin?:0 | 1 | 2,
    isDeleted?:boolean,
    isBanned?:boolean,
    page?:number,
    pageSize?:number
}

//获取所有用户详细信息
export function getAllAppUsersProfiles(pageNumber:string,pageSize:string){
    return AxiosRequest.get(`/web/users?page=${pageNumber}&pageSize=${pageSize}`)
}
//查询指定用户详细信息（根据用户id）
export function searchAppUserProfilesWithId(userId:string){
    return AxiosRequest.get(`/web/users/${userId}`)
}
//根据用户名查询指定用户信息(待定)
export function searchUserProfilesWithOther(params:AppUserProps){
    return AxiosRequest.get(`/web/users`,{},params)
}
//查询指定用户的登录历史（待定）
export function searchAppUserLoginHistory(userId:string){
    return AxiosRequest.get(`/web/users/${userId}/login-history`)
}
//修改指定用户信息
export function changeAppUserProfiles(body:AllUserResp | ''){
    return AxiosRequest.put('/web/users',body)
}