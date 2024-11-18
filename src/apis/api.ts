//api/api.ts

const baseURL = 'http://localhost:8000';

const endpoints = {

    //auth
    login: '/auth/login/',
    users: '/user/',
    refresh: '/auth/refresh/',

    //web
    web: '/website/1/',

    //current user lgin
    currentUser: '/user/detail/',

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
};

export { baseURL, endpoints };
