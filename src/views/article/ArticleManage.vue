<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artDelService, artGetListService } from '@/api/article.js'
import { timeFormat } from '@/utils/formattime';
import ArticleEdit from './components/ArticleEdit.vue'
// 假数据
const articleList = ref([])
const total = ref(0)
const params = ref({
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
})
const loading = ref(false)

const getArticleList = async () => {
    loading.value = true
    const res = await artGetListService(params.value)
    articleList.value = res.data.data
    total.value = res.data.total
    loading.value = false
}
getArticleList()

const handleSizeChange = (size) => {
    params.value.pagenum = 1
    params.value.pagesize = size
    getArticleList()
}

const handleCurrentChange = (page) => {
    params.value.pagenum = page
    getArticleList()
}

const onSearch = () => {
    params.value.pagenum = 1
    getArticleList()
}

const onReset = () => {
    params.value.pagenum = 1
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
}

const articleEditRef = ref()
const onAddArticle = () => {
    articleEditRef.value.open({})
}
const onEditArticle = (row) => {
    articleEditRef.value.open(row)
}
const onDelArticle = async (row) => {
    await ElMessageBox.confirm(
        '确认删除吗',
        '提示',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
    await artDelService(row.id)
    ElMessage.success('删除成功')
    await getArticleList()
}

const onSuccess = async (type) => {
    if (type === 'add') {
        params.value.pagenum = Math.ceil((total.value + 1) / params.value.pagesize)
    }
    await getArticleList()
}

</script>

<template>
    <page-container title="文章管理">
        <template #extra>
            <el-button @click="onAddArticle">添加文章</el-button>
        </template>
        <el-form inline>
            <el-form-item label="文章分类">
                <ChannelSelect v-model="params.cate_id" width="150px"></ChannelSelect>
            </el-form-item>

            <el-form-item label="发布状态">
                <el-select style="width: 150px;" v-model="params.state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">搜索</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="articleList">
            <el-table-column label="文章标题">
                <template #default="{ row }">
                    <el-link :underline="false">{{ row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="分类">
                <template #default="{ row }">
                    {{ row.cate_name }}
                </template>
            </el-table-column>
            <el-table-column label="发布时间"><template #default="{ row }">
                    {{ timeFormat(row.pub_time) }}
                </template></el-table-column>
            <el-table-column label="状态"><template #default="{ row }">
                    {{ row.state }}
                </template></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button plain type="primary" circle :icon="Edit" @click="onEditArticle(row)"></el-button>
                    <el-button plain circle :icon="Delete" @click="onDelArticle(row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
                :page-sizes="[2, 3, 5, 10]" :background="true" layout="jumper,total, sizes, prev, pager, next"
                :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                style="justify-content: end; margin-top: 20px;" />
        </div>

        <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>

    </page-container>
</template>