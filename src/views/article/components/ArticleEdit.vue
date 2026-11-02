<script setup>
import { nextTick, ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artEditService, artGetDetail, artPublishService } from '@/api/article.js'
import { baseURL } from '@/utils/request.js'

const imgUrl = ref()
const deafultForm = ref({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
})
const formModel = ref({
  ...deafultForm.value
})
const drawerVisible = ref(false)
const quillRef = ref()
const open = async (row) => {
  drawerVisible.value = true

  if (row.id) {
    const res = await artGetDetail(row.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    const file = await urlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    imgUrl.value = ''
    formModel.value = { ...deafultForm.value }
    await nextTick()
    quillRef.value.setHTML('')
  }
}

// 封装一个通用函数
const urlToFile = async (url, fileName) => {
  // 1. 发送请求获取图片数据
  const response = await fetch(url)
  // 2. 将数据转换成 Blob 对象
  const blob = await response.blob()
  // 3. 包装成 File 对象（参数：数据，文件名，配置项）
  return new File([blob], fileName, { type: blob.type })
}

const emit = defineEmits(['success'])

const onPublish = async (state) => {
  formModel.value.state = state

  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key]
    )
  }

  if (formModel.value.id) {
    await artEditService(fd)
    drawerVisible.value = false
    ElMessage.success('更新成功')
    emit('success', 'edit')
  } else {
    await artPublishService(fd)
    drawerVisible.value = false
    ElMessage.success('发布成功')
    emit('success', 'add')
  }
}

defineExpose({
  open
})

const selectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}
</script>

<template>
  <el-drawer v-model="drawerVisible" :title="formModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="selectFile">
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor theme="snow" v-model:content="formModel.content" content-type="html" ref="quillRef">
          </QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang='scss' scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>