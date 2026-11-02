<script setup>
    import { artGetChannelsService } from '@/api/article';
    import { ref } from 'vue';
    const ChannelList = ref([])
    const emit = defineEmits(['update:modelValue'])
    const getChannelList =async () => {
        const res = await artGetChannelsService()
        ChannelList.value = res.data.data
    }
    getChannelList()
    defineProps ({
        modelValue:{
            type:[Number,String]
        },
        width:{
            type:String
        }
    })
    
</script>
<template>
            <el-select
                :modelValue="modelValue"
                @update:modelValue="emit('update:modelValue',$event)"
                :style="{width}"
            >
                <el-option 
                v-for="Channel in ChannelList"
                :key="Channel.id"
                :label="Channel.cate_name"
                :value="Channel.id"
            ></el-option>
            </el-select>
</template>