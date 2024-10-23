<template>
  <el-dialog v-model="dialogVisible" title="中枢神经预警与诊疗辅助决策系统" width="700px" :before-close="handleClose">
    <span>请提交您的数据文件</span>
    <el-upload class="upload-demo" drag multiple :file-list="fileList" action="#" @change="handleChange"
      :before-upload="beforeUpload" :accept="formulaStyle" :on-success="handleSuccess">
      <el-icon class="el-icon--upload">
        <Plus />
      </el-icon>
      <div class="el-upload__text">点击或拖拽文件到此处上传</div>
      <div class="el-upload__text">支持{{ formulaStyle }}</div>
      <template #tip>
        <div class="el-upload__tip">
          <div v-if="fileName">当前文件: {{ fileName }}</div>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">Confirm</el-button> -->
        <el-button type="primary" @click="exportFile">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { FileApi } from '@/api';

const fileName = ref() //记录文件名
const fileMediate = ref() //记录文件
const formulaStyle = ref()
const filePath = ref()
//打开弹窗方法
const dialogVisible = ref(false)
const emit = defineEmits<{
  (event: 'getFile', fileName: string | null): void,
  (event: 'failure', file: string | null): void
}>()
const open = (FormuStyle: string) => {
  dialogVisible.value = true
  formulaStyle.value = FormuStyle
  console.log(formulaStyle.value)
}
//获取绝对路径
const handleSuccess = (response: any, file: any, fileList: any[]) => {
  if (response.success) {
    // filePath.value = response.data.path
    // console.log('文件路径:', filePath)
    console.log("rsepone:", response)
  } else {
    ElMessage.error(response.message || '文件上传失败')
  }
}

defineExpose({ open })
//关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
}

//获取文件
const fileList = ref<any[]>([])
const handleChange = (file: any, fileList: any[]) => {
  console.log(fileList)
  if (fileList.length) {
    const currentFile = fileList[0];
    if (judegType(currentFile)) {
      fileName.value = currentFile.name; // 获取文件名
      fileMediate.value = currentFile; // 更新当前文件
    }
  }
}
//判读文件类型
const judegType = (currentFile: any) => {
  // 检查文件扩展名
  const isCsv = currentFile.name.endsWith(formulaStyle.value);
  console.log(typeof currentFile)
  if (isCsv) {
    console.log(`这是一个有效的 ${formulaStyle.value} 文件`);
    return true
  } else {
    console.error(`不支持的文件类型，必须是 ${formulaStyle.value} 文件`);
    // alert(`不支持的文件类型，必须是 ${formulaStyle.value} 文件`)
    ElMessage.error(`不支持的文件类型，必须是 ${formulaStyle.value} 文件`)
    return false
  }
}
//阻止自动上传
const beforeUpload = (file: any) => {
  // Handle file selection without uploading
  console.log('Selected file before upload:', file)
  return false
  // return false // Prevent automatic upload
}

//导出文件
const exportFile = async () => {
  dialogVisible.value = false
  if (fileMediate.value) {
    console.log("file:", fileMediate.value.raw)
    try {
      const res = await FileApi.exportCsv(fileMediate.value.raw);
      // const res = await FileApi.TestApi(fileName.value);
      console.log(res)
    } catch (error) {
      ElMessage.error(error)
    }
    emit('getFile', fileName.value)
  }
}

</script>

<style scoped></style>
