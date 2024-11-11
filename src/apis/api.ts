//api/api.ts

const baseURL = 'http://localhost:8000';

const endpoints = {

    //auth
    login: '/auth/login/',
    users: '/user/',

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


    //Doc
    documents: '/document/',
    document: '/document/:id/',

    //News
    news: '/news/',
    new: '/news/:id/',

    //blog
    blogs: '/blog/',
};

export { baseURL, endpoints };
