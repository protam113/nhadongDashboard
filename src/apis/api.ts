//api/api.ts

/**
 Base URL
 **/


// const baseURL = 'http://localhost:8000';
const baseURL = 'http://103.20.102.30:8000/';

/**
End Points aPI
 **/


const endpoints = {

    //auth
    login: '/auth/login/',
    users: '/user/',
    refresh: '/auth/refresh/',

    //web
    web: '/website/1/',

    //user
    blocked: '/user/block/',

    //current user lgin
    currentUser: '/user/detail/',
    updateProfile: '/user/update-profile/',

    //queue
    queues: '/queue/',
    queueApprove: '/queue/browse/',
    activeUser: '/user/active/',

    //category(thể loại)
    categories:  '/category/',
    category: '/category/:id/',

    //role
    roles: '/role/',
    roleAddUserToManager: '/role/decentralize/',
    blockUser: '/user/block/',

    //group
    groups: '/group/',
    group: '/group/:id/',
    groupMember: '/group/:id/member/',
    groupRole: '/group/:id/role/',


    //Doc
    documents: '/document/',
    document: '/document/:id/',

    //News
    news: '/news/',
    new: '/news/:id/',

    //blog
    blogs: '/blog/',
    blog: '/blog/:id/',
    likeBlog: '/blog/:id/like/',
    commentBlog: '/blog/:id/comment/',
    replyComment: '/comment/:id/replies/',
    comment: '/comment/:id/',

    //event

    events: '/event/',
    event: '/event/:id/',
    eventForm: '/event/:id/form/',
    eventRegister: '/event/:id/register/',

    //event

    missions: '/mission/',
    mission: '/mission/:id/',


    //schedule

    schedules: '/schedule/',
    schedule: '/schedule/:id/feast/',


    //nha dong

    nhaDong: '/website/',

    //password
    changePassword: '/password/change-password/',
    codePassword: '/password/reset-password/',
    verifyCode: '/password/verify-code/',
};

export { baseURL, endpoints };
