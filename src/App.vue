<script setup>
import { ref } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const language = ref(zhCn)
const toggaleLang = () => language.value = (language.value == zhCn ? en : zhCn)
</script>

<template>
  <div>
    <el-config-provider :locale="language == zhCn ? zhCn:en">
      <el-button @click="toggaleLang">English/中文</el-button>
  <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped>
</style>
