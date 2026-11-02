<script setup>
import { artAddChannelService, artEditChannelService } from '@/api/article';
import { ref } from 'vue';
const dialogVisible = ref(false)
const emit = defineEmits(['success'])

const open = (row) => {
    formModel.value = { ...row }
    dialogVisible.value = true
}

const formModel = ref({
    cate_name: '',
    cate_alias: ''
})
const formRef = ref()
const rules = {
    cate_name: [
        { required: true, message: "请输入分类名称", trigger: "blur" },
        { pattern: /^[a-z0-9]{1,15}$/, message: "请输入1-15字符", trigger: "blur" }
    ],
    cate_alias: [
        { required: true, message: "请输入别名", trigger: "blur" },
        { pattern: /^[a-z0-9]{1,15}$/, message: "请输入1-15字符", trigger: "blur" }
    ]
}

const onSubmit = async () => {
    const isEdit = formModel.value.id
    await formRef.value.validate()
    if (isEdit) {
        await artEditChannelService(formModel.value)
    } else {
        await artAddChannelService(formModel.value)
    }
    dialogVisible.value = false
    emit('success')
}

defineExpose({
    open
})
</script>

<template>
    <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="30%">
        <el-form ref="formRef" :model="formModel" :rules="rules">
            <el-form-item prop="cate_name" label="分类名称">
                <el-input v-model="formModel.cate_name"></el-input>
            </el-form-item>
            <el-form-item prop="cate_alias" label="分类别名">
                <el-input v-model="formModel.cate_alias"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="onSubmit"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>
</template>