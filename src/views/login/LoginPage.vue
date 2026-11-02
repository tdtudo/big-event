<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userLoginService, userRegisterService } from '@/api/user.js'
// import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const form = ref()
const register = async () => {
    await form.value.validate()
    await userRegisterService(formModel.value)
    ElMessage('success')
    isRegister.value = false
}

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
    await form.value.validate()
    const res = await userLoginService(formModel.value)
    userStore.setToken(res.data.token)
    ElMessage.success('login success')
    router.push('/')
}

const isRegister = ref(false)
const formModel = ref({
    username:'',
    password:'',
    repassword:''
})

watch(isRegister,() => {
    formModel.value = {
        username:'',
        password:'',
        repassword:''
    }
})

//Form validation rules
const rules = ref({
    username: [
        //非空校验
        {required:true, message:'请输入用户名', trigger:'change'},
        //长度校验
        {min:5, max:10, message:'请输入5-10位字符', trigger:'blur'}
    ],
    password:[        
        //正则校验
        {required:'true', message:'The password cannot be empty', trigger:'blur'},
        {pattern:/^\S{6,15}$/, message:'6-15非空字符', trigger:'blur'}
    ],
    repassword:[        
        //正则校验
        {required:'true', message:'The password cannot be empty', trigger:'blur'},
        {pattern:/^\S{6,15}$/, message:'6-15非空字符', trigger:'blur'},
        {
            validator:(rule, value, callback) => {
                if(value !== formModel.value.password) {
                callback(new Error('two inputs donot match'))
            }else{
                callback()
            }
            },
            trigger:'blur'
        }
    ]
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- register -->
      <el-form 
      :model="formModel" 
      :rules="rules"
      ref="form" 
      size="large" 
      autocomplete="off" 
      v-if="isRegister">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model='formModel.repassword'
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" 
          type="primary" 
          auto-insert-space
          @click="register()">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- login -->
      <el-form 
      :model="formModel"
      :rules="rules"
      ref="form" 
      size="large" 
      autocomplete="off" 
      v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
          v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button 
          class="button" 
          type="primary" 
          auto-insert-space
          @click="login()"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>