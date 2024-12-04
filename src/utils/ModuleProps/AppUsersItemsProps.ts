//用户详细信息列表
export interface UserResp{
    userId?:number,
    username?:string,
    password?:string,
    isAdmin?:number,
    isDeleted?:boolean,
    isBanned?:boolean,
    description?:string
}

export interface UserProfileResp{
    userId?:number,
    avatarUrl?:string,
    bio?:string,
    userLevel?:number,
    gender?:number,
    grade?:string,
    birthDate?:string,
    location?:string,
    website?:string,
    isDeleted?:number,
    description?:string
}

export interface UserStatsResp{
    userId?:number,
    studentNumber?:string,
    articleCount?:number,
    commentCount?:number,
    statementCount?:number,
    likedCount?:number,
    coinCount?:number,
    xp?:number,
    quizType?:number,
    lastLoginTime?:string,
    isDeleted?:number,
    description?:string
}

export interface AllUserResp {
    userResp?:UserResp,
    userProfileResp?:UserProfileResp,
    userStatsResp?:UserStatsResp
}