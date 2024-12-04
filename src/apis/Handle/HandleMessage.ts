import AxiosRequest from '@/utils/requests/index'

export const getUserIdGroupList = (userId:number,page:number,pageSize:number)=>{
    return AxiosRequest.get(`/web/users/${userId}/groups`,{},{
        page,
        pageSize
    })
}
export const getGroupMessageList = (groupId:number,page:number,pageSize:number)=>{
    return AxiosRequest.get(`/web/groups/${groupId}/messages`,{},{
        page,
        pageSize
    })
}

export const searchGroupMessage = (groupId:number)=>{
    return AxiosRequest.get(`/web/groups/${groupId}/messages/search`)
}

export const delGroupMessage = (groupId:number,messageId:number)=>{
    return AxiosRequest.del(`/web/groups/${groupId}/messages/${messageId}`)
}

export const changeGroupMessage = (groupId:number,messageId:number)=>{
    return AxiosRequest.put(`/web/groups/${groupId}/messages/${messageId}`)
}

export const silenceGroupUserId = (groupId:number,memberId:number)=>{
    return AxiosRequest.put(`/web/groups/${groupId}/members/${memberId}/mute`)
}

export const RemoveGroupUserId = (groupId:number,memberId:number)=>{
    return AxiosRequest.del(`/web/groups/${groupId}/members/${memberId}`)
}