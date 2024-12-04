import AxiosRequest from '@/utils/requests/index'
//群聊管理api


//开发组特权
const privilegeCreateGroup = ()=>{
    return AxiosRequest.post('/web/admin/groups')
}

const privilegeDelGroup = (groupId:string)=>{
    return AxiosRequest.del(`/web/admin/groups/${groupId}`)
}

const privilegeAddGroupLeader = (groupId:string)=>{
    return AxiosRequest.post(`/web/admin/groups/${groupId}/owners`)
}

const privilegeLockMessage = (groupId:string)=>{
    return AxiosRequest.put(`/web/admin/groups/${groupId}/lock`)
}
const privilegeMuteMessage = (groupId:string)=>{
    return AxiosRequest.put(`/web/admin/groups/${groupId}/mute`)
}

//常规
const getAllGroupsProfiles = (page:number,pageSize:number)=>{
    return AxiosRequest.get(`/web/groups?page=${page}&pageSize=${pageSize}`)
}