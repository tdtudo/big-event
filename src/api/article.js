import request from '@/utils/request'
//获取文章分类
export const artGetChannelsService = () => {
    return request.get('my/cate/list')
}
//添加分类
export const artAddChannelService = (data) => {
    return request.post("/my/cate/add", data)
}
//编辑分类
export const artEditChannelService = (data) => {
    return request.put('/my/cate/info', data)
}
//删除分类
export const artDelChannelService = (id) => {
    return request.delete('/my/cate/del', {
        params: { id }
    })
}

//获取文章列表
export const artGetListService = (params) => {
    return request.get('/my/article/list', {
        params
    })
}

//发布/编辑文章
export const artPublishService = (data) => {
    return request.post('/my/article/add', data)
}
//删除文章
export const artDelService = (id) => {
    return request.delete('/my/article/info', {
        params: { id }
    })
}

//获取文章详情
export const artGetDetail = (id) => {
    return request.get('/my/article/info', {
        params: { id }
    })
}

//更新文章内容
export const artEditService = (data) => {
    return request.put('/my/article/info', data)
}