<template>
  <el-dialog v-model="dialogVisible" title="中枢神经预警与诊疗辅助决策系统" width="1000px" :before-close="handleClose">
    <div class="box">
      <div class="box_left">
        <el-button type="primary" @click="testData('1')">数据集一</el-button>
        <el-button type="primary" @click="testData('2')">数据集二</el-button>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="fileName" width="250" />
        </el-table>
      </div>
      <div class="box_right">
        <el-button type="primary" @click="testROC" v-loading="makeingROC"
          :disabled="(makeingROC == true)">getChart</el-button>
        <el-button type="primary" @click="getROC">test</el-button>
        <div class="chart">
          <img v-if="IsROCExist == true" :src="ROCPath" alt="">
          <span v-else
            style="font-family: Arial, sans-serif; font-size: 16px; color: #333;text-align: center;">ROC图待绘制</span>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose()">Cancel</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">Confirm</el-button> -->
        <el-button type="primary" @click="downTest">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { FileApi } from '@/api';
const list = ref(['请选择数据集...'])
const dataUid = ref()//数据集id
const makeingROC = ref(false)
const ROCPath = ref()//ROC存储url
const IsROCExist = ref(false)//判断ROC是否存在
const tableData = computed(() => {
  return list.value.map(file => ({ name: file }));
});
const emit = defineEmits<{
  (event: 'closeDialog'): void
}>()
//打开弹窗方法
const dialogVisible = ref(false)
const open = () => {
  console.log("success")
  dialogVisible.value = true
}
defineExpose({ open })
//关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  emit('closeDialog')
}
//
const downTest = () => {
  dialogVisible.value = false
  emit('closeDialog')
}
//测试
const testData = (id: string) => {
  FileApi.getTestData(id).then((res) => {
    console.log(res.data.data)
    list.value = res.data.data
  })
  dataUid.value = id
}
//测试ROC绘图
const testROC = async () => {
  if (dataUid.value == undefined) {
    ElMessage.error("请先选择数据集")
    return
  }
  IsROCExist.value = false
  makeingROC.value = true
  ElMessage.success('正在绘制ROC图')
  try {
    const res = await FileApi.makeROC(dataUid.value);
    getROC()
    console.log(res)
  } catch (error) {
    ElMessage.error('绘制失败:', error)
  } finally {
    makeingROC.value = false
  }

}
//得到ROC绘图
const getROC = async () => {
  try {
    const res = await FileApi.getROC();// 确保设置responseType为'blob
    console.log("得到的ROC响应:", res);
    const blob = res.data;//直接使用Blob数据
    ROCPath.value = URL.createObjectURL(blob);//生成对象URLPngPath.value=imageUrl;//保存图像路径
    // downloadBlob(blob, '1.png')
  } catch (error) {
    console.log(error)
  }
}
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename || 'download';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url); // 释放 URL 对象
  document.body.removeChild(a);
};
// 监听 ROCPath 的变化
watch(ROCPath, (newVal, oldVal) => {
  if (newVal) {
    console.log('ROCPath 更新为:', newVal);
    IsROCExist.value = true
    ElMessage.success('绘制成功')
    // 在这里可以执行其他操作，例如释放旧的 URL
    if (oldVal != undefined) {
      URL.revokeObjectURL(oldVal); // 释放旧的 URL
    }
  } else {
    console.log('ROCPath 被重置');
  }
});
</script>
<style scoped>
.box {
  display: flex;
  justify-content: space-between;
  /* 使整个容器占满视口高度 */
}

.box_left,
.box_right {
  padding: 20px;
}

.box_left {
  width: 40%;
  /* 左侧区域占50%宽度 */
  border-right: 1px solid #dcdcdc;
}

.box_right {
  width: 60%;
  /* 右侧区域占50%宽度 */
  background-color: #ffffff;
}

.chart {
  height: 527px;
  /* 设置图表的高度 */
  background-color: #f9f9f9;
  margin-top: 20px;
  border: 1px solid #dcdcdc;
}

.chart img {

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 使图片覆盖整个 div，可能会裁剪图片 */
  /* 或者使用 object-fit: contain; 使图片完全可见，但可能留白 */
}
</style>