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

    //category(thể loại)
    categories:  '/category/',
    category: '/category/:id/',

    //role
    roles: '/role/',
    roleAddUserToManager: '/role/decentralize/',

    //blog
    blogs: '/blog/',
};

export { baseURL, endpoints };
