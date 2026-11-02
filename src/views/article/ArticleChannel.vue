<script setup>
import { ref } from 'vue'
import { artDelChannelService, artGetChannelsService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const ChannelEditRef = ref()

const loading = ref()
const channelList = ref([])
const getChannelList = async () => {
    loading.value = true
    const res = await artGetChannelsService()
    channelList.value = res.data.data
    loading.value = false
}
getChannelList()
const onEdit = (row) => ChannelEditRef.value.open(row);
const onDel = async (row) => {
    await ElMessageBox.confirm('are you sure to delete it', '温馨提示', {
        type: 'warning',
        confirmButtonText: "confirm",
        cancelButtonText: 'cancel'
    })
    await artDelChannelService(row.id)
    ElMessage.success('删除成功')
    getChannelList()
}

const onAddChannel = () => ChannelEditRef.value.open({})
const onSuccess = () => getChannelList()

</script>

<template>
    <page-container title="文章分类">
        <template #extra>
            <el-button @click="onAddChannel()">添加分类</el-button>
        </template>
        <el-table v-loading="loading" :data="channelList" style="width: 100%;">
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="cate_name" label="分类名称"></el-table-column>
            <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row, $index }">
                    <el-button circle type="primary" plain :icon="Edit" @click="onEdit(row, $index)">
                    </el-button>
                    <el-button circle type="danger" plain :icon="Delete" @click="onDel(row, $index)">
                    </el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="123"> </el-empty>
            </template>
        </el-table>
        <channel-edit ref="ChannelEditRef" @success="onSuccess"></channel-edit>
    </page-container>
</template>