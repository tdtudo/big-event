import request from '@/utils/request.js'


//注册请求
export const userRegisterService = ({ username, password, repassword }) =>
    request.post('/api/reg', { username, password, repassword })

//登录请求
export const userLoginService = ({ username, password }) => request.post('/api/login', { username, password })

//获取用户信息
export const userGetInfoService = () => {
    return request.get('/my/userinfo')
}

//修改基本资料
export const useEditInfoService = (data) => {
    return request.put('/my/userinfo', data)
}

//上传头像
export const useEditAvatar = (avatar) => {
    return request.patch('/my/update/avatar', { avatar })
}

//更新密码
export const useUpdatePwd = ({ old_pwd, new_pwd, re_pwd }) => {
    return request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
}