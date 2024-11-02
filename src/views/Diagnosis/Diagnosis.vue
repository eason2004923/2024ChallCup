<template>
  <div id="app">
    <header>
      <h1>Diagnosis</h1>
    </header>

    <div class="info">
      <div class="brfore">
        <div class="content-introduction">
          <p>information………</p>
        </div>
        <div class="content-information">
          <div>
            <el-button v-loading="uploading" :disabled="(uploading == true)" @click="openForm('.csv')"
              class="upload-button"><span title="CSV文件上传">csv
                file
                upload</span></el-button>
            <span class="file-name">当前文件：{{ fileName }}</span>
            <el-button>
              test_perfrom
            </el-button>
          </div>
          <br />
          <div>
            <el-button v-loading="submitting" :disabled="(submitting == true)" :plain="true" @click="submitPath"
              class="submit-button" title="submit出错提示">submit</el-button>
            <el-button class="button1" @click="getPredict" title="Description">Description</el-button>
            <el-button class="button1" @click="acquireGrn" title="Description">testPNG</el-button>
            <el-button class="button1" @click="ConnectSSE" title="Description">testSSEOpen</el-button>
            <el-button class="button1" @click="GetSSE" title="Description">getSSE</el-button>
            <el-button class="button1" @click="CloseSSE" title="Description">testSSEClose</el-button>
            <ImportFile ref="RefFile_csv" @getFile="getFileName" @closeDialog="closeUpload" />
          </div>
        </div>
      </div>
    </div>

    <div class="flow-path">
      <p title="按钮进度显示">Button progress display:</p>
      <el-progress :percentage="progress" class="el-progress"></el-progress>
      <div class="steps-description">
        <span :class="{ show: progress >= 33 }">First step: Upload</span>
        <span :class="{ show: progress >= 66 }">Second step: Inference</span>
        <span :class="{ show: progress >= 100 }">Third step: Description</span>
      </div>
    </div>

    <div class="content">
      <div class="content-left content-ex">
        <div class="content-left-button">
          <el-button class="button3" @click="pathologybutton" title="病理等级输出">Pathology Grade Output:</el-button>
        </div>
        <div v-if="pathologyGrade !== null" class="pathology-info" @click="pathologybutton">
          {{ pathologyGrade }}
        </div>
      </div>
      <div class="content-right content-ex">

        <div class="content-right-bottom" ref="viewerContainer">
          <img :src="PngPath" alt="模型生成GRN图" class="viewer-container viewer-image" @click="openViewer" />
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content-ex content-left-console">
        <div class="console">
          <div class="console-header">
            <h3>Console</h3>
          </div>
          <div class="console-body">
            <div class="console-output" v-for="(message, index) in consoleMessages" :key="index">
              {{ message }}
            </div>
          </div>
        </div>
      </div>


      <el-dialog :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
        <div ref="viewerContainer">
          <img :src="PngPath" alt="无法加载" class="viewer-image" @click="openViewer" />
        </div>
      </el-dialog>

      <div class="content-right-picture">
        <div class="content-right-button">
          <p>图片介绍：.......</p>
        </div>
      </div>
    </div>

    <nav>
      <ul>
        <li><a href="/" title="首页">index</a></li>
        <li><a href="/background" title="背景情况介绍">background</a></li>
        <li><a href="/description" title="辅助诊断AI系统简介">description</a></li>
      </ul>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { ElMessage, ElNotification, ElProgress, ElDialog } from 'element-plus'
import ImportFile from './element/importFile.vue'
import { ref, toRef } from 'vue'
import { FileApi } from '@/api/index'
import { ESLint } from 'eslint'
import { errorMessages } from 'vue/compiler-sfc'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { nextTick } from 'vue';
import { connect } from 'http2'

const fileName = ref('The file was not entered')
const filePath = ref('NULL')
const PngPath = ref('../public/tutor.png')
const RefFile_csv = ref()
const RefFile_loom = ref()
const consoleMessages = ref([])
const pathologyGrade = ref(null) // 添加病理等级响应式数据属性
const progress = ref(0) // 定义进度变量
const dialogVisible = ref(false);
const viewerInstance = ref(null);
const viewerContainer = ref(null);
const uploading = ref(false)//csv upload按钮的加载显示
const perdicting = ref(false)//desrciption按钮加载显示
const submitting = ref(false)//submit按钮加载显示
let eventSource//SSE连接
const uid = ref()
const executeCommand = () => {
  // 这里可以添加执行命令的逻辑
  console.log(inputCommand.value)
  // 假设我们只是打印到console台
  consoleMessages.value.push(`> ${inputCommand.value}`)
  inputCommand.value = ''
}

const inputCommand = ref('')
//打开弹窗
const openForm = (tool: string) => {
  uploading.value = true
  RefFile_csv.value.open(tool)
}
//关闭upload弹窗
const closeUpload = () => {
  uploading.value = false
}
// 获取文件名
const getFileName = async (tool) => {
  console.log(tool)
  fileName.value = tool
}
//开始绘图
const submitPath = async () => {
  // if (fileName.value == "The file was not entered") {
  //   ElMessage.error('请先上传文件')
  //   return
  // }
  submitting.value = true
  try {
    const res = await FileApi.makeGrn(uid.value); // 上传文件名
    console.log("GRN图绘制成功:", res);
    ElMessage.success(`正在绘制GRN图`);
    progress.value = 33; // 绘图后进度条前进到1/3
    acquireGrn()
  } catch (error) {
    console.error('Error makeing PNG:', error);
    ElMessage.error('Error makeing PNG:', error);
    progress.value = 33;
  }
  submitting.value = false
};
//获取绘图
// const acquireGrn = async () => {
//   try {
//     const res = await FileApi.getGrn()
//     console.log("得到的GRN响应:", res)
//     if (typeof res.data === 'string') {
//       console.log('Data is a String, possibly Base64 encoded');
//     }
//     // 根据响应头中 content-type 来确定 Blob 的 MIME 类型
//     const contentType = res.headers['content-type'] || 'image/png';
//     console.log("contentType", contentType);
//     const uint8Array = new Uint8Array(res.data.length);
//     for (let i = 0; i < res.data.length; i++) {
//       uint8Array[i] = res.data.charCodeAt(i);
//     }
//     console.log('uint8Array', uint8Array)
//     // 创建一个 Blob 对象
//     const blob = new Blob([uint8Array], { type: 'image/png' });
//     console.log("blob:", blob)
//     // 生成一个对象 URL
//     const imageUrl = URL.createObjectURL(blob);
//     PngPath.value = imageUrl;

//     console.log("Grn图url:", PngPath.value);
//     progress.value = 66; // 绘图后进度条更新到66%
//     downloadBlob(blob, 'image.png');
//   } catch (error) {
//     console.error('Error getting PNG:', error);
//     ElMessage.error('Error getting PNG:', error);
//   }
// }

const acquireGrn = async () => {
  try {
    const res = await FileApi.getGrn();// 确保设置responseType为'blob
    console.log("得到的GRN响应:", res);
    const blob = res.data;//直接使用Blob数据
    PngPath.value = URL.createObjectURL(blob);//生成对象URLPngPath.value=imageUrl;//保存图像路径
    console.log("Grn图url:", PngPath.value); progress.value = 66;//绘图后进度条更新到66%downloadBlob(blob,'image.png');//使用downloadBlob下载Blob} catch(error){
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
  } catch (error) {
    console.log(error)
  }
}
// 定义病理等级的描述
const gradeDescriptions = {
  1: 'Patient-pathology stage is 1：NO DEMENTIA SEEN',
  2: 'Patient-pathology stage is 2:SUBJECTIVE MEMORY LOSS, AGE RELATED FORGETFULNESS',
  3: 'Patient-pathology stage is 3: MILD COGNITIVE IMPAIRMENT',
  4: 'Patient-pathology stage is 4: MODERATE COGNITIVE DECLINE, MILD DEMENTIA',
  5: 'Patient-pathology stage is 5: MODERATELY SEVERE COGNITIVE DECLINE, MODERATE DEMENTIA',
  6: 'Patient-pathology stage is 6: SEVERE COGNITIVE DECLINE, MODERATELY SEVERE DEMENTIA',
  7: 'Patient-pathology stage is 7:VERY SEVERE COGNITIVE DECLINE, SEVERE DEMENTIA'
}
// 预测按钮
const getPredict = async () => {

  if (fileName.value == "The file was not entered") {
    ElMessage.error('请先上传文件')
    return
  }
  // if (progress.value < 33) {
  // ElMessage.warning('Please upload a file first.');
  // } else {
  try {
    console.log(fileName.value)
    const res = await FileApi.getHealthMess(fileName.value) // 确保文件上传成功后再继续
    console.log(res)
    const grade = Number(res.data.data)// 服务器返回的纯文本数字
    console.log('预测病理等级为:', grade)
    pathologyGrade.value = gradeDescriptions[grade + 1] // 使用映射获取病理等级描述
    progress.value = 100 // 获取病理等级后进度条前进到100%
  } catch (error) {
    console.error('预测失败:', error);
    ElMessage.error('预测失败');
  }
  // }
};


// 获取病理等级
const getpathologygrade = async () => {
  try {
    // 从服务器获取病理等级
    const response = await FileApi.getHealthMess(fileName.value)
    const grade = await response.data // 服务器返回的纯文本数字
    pathologyGrade.value = gradeDescriptions[grade] // 使用映射获取病理等级描述
    progress.value = 100 // 获取病理等级后进度条前进到100%
  } catch (error) {
    console.error('获取病理等级失败:', error)
    ElMessage.error('无法获取病理等级')
  }
}
//病理显示按钮
const pathologybutton = async () => {
  if (progress.value < 66) {
    ElMessage.warning('Please draw the picture first.');
  } else {
    await getpathologygrade(); // 调用获取病理等级的方法
  }
};

const openViewer = () => {
  dialogVisible.value = true;

  // 使用 nextTick 确保 DOM 更新完成
  nextTick()
  // 确保 viewerContainer 不是 null
  if (viewerContainer.value) {
    // 使用 ref 直接获取 DOM 元素
    const imgElement = viewerContainer.value.querySelector('.viewer-image');
    if (imgElement) {
      // 初始化 Viewer 实例
      viewerInstance.value = new Viewer(imgElement, {
        navbar: false,
        title: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true,
        inline: false,
        loading: true,
        zoomRatio: 0.1,
        minZoomRatio: 0.05,
        maxZoomRatio: 5,
      });
    } else {
      console.error('Image element not found');
    }
  } else {
    console.error('Viewer container not found');
  }
};

const handleClose = () => {
  dialogVisible.value = false;
  if (viewerInstance.value) {
    viewerInstance.value.destroy();
    viewerInstance.value = null;
  }
};
//连接SSE

const ConnectSSE = () => {
  CloseSSE();
  uid.value = 123
  eventSource = new EventSource(`http://121.41.52.142:5090/sse/createSse?uid=${uid.value}`);
  eventSource.onopen = function (event) {
    console.log('SSE链接成功');
  }
  eventSource.onmessage = function (event) {
    if (event.data) {
      console.log(event.data)
      consoleMessages.value.push(`> ${event.data}`)
    }
  }
  eventSource.onerror = function (error) {
    console.error('SSE发生错误:', error, 'readyState:', eventSource.readyState);
    // 可以在这里添加重试逻辑或其他错误处理
  };
}
const GetSSE = () => {
  if (eventSource) {
    FileApi.getConsole(uid.value)
  }
}
const CloseSSE = () => {
  if (eventSource) {
    eventSource.close()
    console.log('SSE connection closed.');
    eventSource = null; // 清除引用
  }
}
</script>
<style scoped>
@import '@/assets/base.css';
</style>