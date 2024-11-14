<template>
  <div id="app">
    <header>
      <h1>Diagnosis</h1>
    </header>

    <div class="flow-path">
      <p title="按钮进度显示">Button progress display:</p>
      <el-progress :percentage="progress" class="el-progress"></el-progress>
      <div class="steps-description">
        <span  :class="{ show: progress >= 33 }">First step: Upload</span>
        <span  :class="{ show: progress >= 66 }">Second step: Inference</span>
        <span  :class="{ show: progress >= 100 }">Third step: Description</span>
      </div>
    </div>

  <div class="content"> 
    <div class="content1">
      <div class="content-left">
        <div class="info">
          <div class="brfore">
            <div class="content-introduction">
              <p>information………</p>
            </div>
            <div class="content-information">
              <div>
                <el-button type="primary" v-loading="uploading" :disabled="(uploading == true)" @click="openUpload('.csv')" class="upload-button">
                  <span title="CSV文件上传">csv File upload</span>
                </el-button>
                <span class="file-name">当前文件：{{ fileName }}</span>
                <el-button type="primary" v-loading="testing" :disabled="(testing == true)" @click="openSystem">
                  Test_System
                </el-button>
              </div>
              <br />
              <div>
                <el-button class="button1"type="primary" :plain="true" v-loading="submitting" :disabled="(submitting == true)" @click="submitPath" title="submit出错提示">Submit</el-button>
                <el-button type="primary" :plain="true" @click="getPredict" titl e="Description" v-loading="perdicting"
                :disabled="(perdicting == true)">Description</el-button>
              </div>
              <div>
                <button class="content-export-button" >Report export</button>
              </div>
            </div>
          </div>
        </div>
        <div class="content-left-button">
          <el-button class="button3" @click="pathologybutton" title="病理等级输出">Pathology Grade Output:</el-button>
        </div>
        <div v-if="pathologyGrade !== null" class="pathology-info" @click="pathologybutton">
          {{ pathologyGrade }}
        </div>
        <div v-else class="pathology-info" @click="pathologybutton">
          <span>等待预测病理阶段</span>
        </div>
      </div>
      <div class="content-left-console">
        <div class="console">
          <div class="console-header">
            <h3>Console</h3>
          </div>
          <div class="console-body" ref="consoleBody">
            <div class="console-output" v-for="(message, index) in consoleMessages" :key="index">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content2">
      <div class="content-right">
        <div class="content-right-img" ref="viewerContainer">
            <img v-if="IsGRNExist" :src="PngPath" alt="模型生成GRN图" class="viewer-container viewer-image"
              @click="openViewer" />
            <span v-else>GRN图正在等待绘制...</span>
        </div>
        <div class="content-right-info">
          <div class="content-GRN-button">
            <button class="content-GRN-button1">GRN-1</button>
            <button class="content-GRN-button2">GRN-2</button>
          </div>
          <div class="content-GRN-info">
            <p>网络图节点数量：{{ PointNumber }}</p>
            <p>网络图边数量：{{ SideNumber }}</p>
            <p>模块数量：{{ ModNumber }}</p>
          </div>
          <div class="content-GRN-export">
            <button class="content-GRN-export-button"  title="下载图片"  @click="imageload()">Picture export</button>
          </div>
        </div>
      </div>
    </div>
  </div> 
    
    <el-dialog :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
        <div ref="viewerContainer">
          <img :src="PngPath" alt="无法加载" class="viewer-image" @click="openViewer" />
        </div>
    </el-dialog>

    <footer>
      <ul>
        <li><a href="/" title="首页">Index</a></li>
        <li><a href="/background" title="背景情况介绍">Background</a></li>
        <li><a href="/description" title="辅助诊断AI系统简介">Description</a></li>
      </ul>
      <p>Copyright © 2024.zstu.digital medicine All rights reserved.</p>
    </footer>
  </div>
  <div id="particles-container" class="myElement"></div>
  <ImportFile ref="Refupload" @getFile="getFileName" @closeDialog="closeUpload" />
  <TestSystem ref="RefSystem" @closeDialog="closeSystem" />
</template>

<script setup lang="ts">
import"@/router/jquery-2.1.1.min.js";
import"@/router/particle-1.1.min.js";
import"@/router/diagnosis.js";
import { ElMessage, ElNotification, ElProgress, ElDialog } from 'element-plus'
import ImportFile from './element/importFile.vue'
import TestSystem from './element/testSystem.vue'
import { onMounted, ref } from 'vue';
import { FileApi } from '@/api/index'
import { ESLint } from 'eslint'
import { errorMessages } from 'vue/compiler-sfc'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { nextTick } from 'vue';
import { connect } from 'http2'
import $ from 'jquery';

const fileName = ref('The file was not entered')
const filePath = ref('NULL')
const PngPath = ref('../public/tutor.png')
const RefFile_loom = ref()
const consoleMessages = ref([])
const pathologyGrade = ref(null) // 添加病理等级响应式数据属性
const dialogVisible = ref(false);
const viewerInstance = ref(null);
const viewerContainer = ref(null);
const uploading = ref(false)//csv upload按钮的加载显示
const testing = ref(false)//test_System按钮的加载显示
const perdicting = ref(false)//desrciption按钮加载显示
const submitting = ref(false)//submit按钮加载显示
const particleBackground = ref(null);
let eventSource//SSE连接
const uid = ref()
const progress = ref(0) // 定义进度变量
const IsGRNExist = ref(false)//submit按钮加载显示
const PointNumber = ref('未存在图片')//网络图节点数量
const SideNumber = ref('未存在图片')//网络图边数量
const ModNumber = ref('未存在图片')//模块数量

const executeCommand = () => {
  // 这里可以添加执行命令的逻辑
  console.log(inputCommand.value)
  // 假设我们只是打印到console台
  consoleMessages.value.push(`> ${inputCommand.value}`)
  inputCommand.value = ''
}

const inputCommand = ref('')
//打开upload弹窗
const Refupload = ref()
const openUpload = (tool: string) => {
  uploading.value = true
  Refupload.value.open(tool)
  progress.value = 33 // 获取病理等级后进度条前进到1/3
}
//关闭upload弹窗
const closeUpload = () => {
  uploading.value = false
}
//打开System弹窗
const RefSystem = ref()
const openSystem = () => {
  testing.value = true
  RefSystem.value.open()
}
//关闭System弹窗
const closeSystem = () => {
  testing.value = false
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
  IsGRNExist.value = false
  try {
    ConnectSSE()
    console.log('正在绘制图片', fileName.value, uid.value)
    const res = await FileApi.makeGrn(fileName.value, uid.value); // 上传文件名
    console.log("GRN图绘制成功:", res);
    progress.value=66; // 绘图后进度条前进到2/3
    ElMessage.success(`正在绘制GRN图`);
    acquireGrn()
    PointNumber.value = res.data.data['网络图节点数量'];
    SideNumber.value = res.data.data['网络图边数量'];
    ModNumber.value = res.data.data['模块数量'];
  } catch (error) {
    submitting.value = false
    console.error('Error makeing PNG:', error);
    ElMessage.error('Error makeing PNG:', error);
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
    console.log("Grn图url:", PngPath.value);//绘图后进度条更新到66%downloadBlob(blob,'image.png');//使用downloadBlob下载Blob} catch(error){
    IsGRNExist.value = true
    downloadBlob(blob, '1.png')
  } catch (error) {
    console.log(error)
  }
  submitting.value = false
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
    perdicting.value = true
  try {
    console.log(fileName.value)
    ElMessage.success('正在预测病理阶段')
    const res = await FileApi.getHealthMess(fileName.value) // 确保文件上传成功后再继续
    console.log(res)
    const grade = Number(res.data.data)// 服务器返回的纯文本数字
    console.log('预测病理等级为:', grade)
    pathologyGrade.value = gradeDescriptions[grade + 1] // 使用映射获取病理等级描述
    ElMessage.success('病理阶段预测成功')
  } catch (error) {
    console.error('预测失败:', error);
    ElMessage.error('预测失败');
    ElMessage.error('病理阶段预测失败');
  }
  perdicting.value = false
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
  if (fileName.value == "The file was not entered") {
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
//方法：滚动到底部
const consoleBody = ref(null);
const scrollToBottom = () => {
  nextTick(() => {
    if (consoleBody.value) {
      consoleBody.value.scrollTop = consoleBody.value.scrollHeight;
    }
  });
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
      scrollToBottom(); // 滚动到底部
    }
  }
  eventSource.onerror = function (error) {
    console.error('SSE发生错误:', error, 'readyState:', eventSource.readyState);
    // 可以在这里添加重试逻辑或其他错误处理
  };
}
const CloseSSE = () => {
  if (eventSource) {
    eventSource.close()
    console.log('SSE connection closed.');
    eventSource = null; // 清除引用
  }
};

    // 下载图片
    function downloadByBlob(url, name) {
        let image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
        image.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width, image.height);
            canvas.toBlob((blob) => {
                let url = URL.createObjectURL(blob);
                download(url, name);
                // 用完释放URL对象
                URL.revokeObjectURL(url);
            }, 'image/png');
        }
    }

    function download(href, name) {
        let eleLink = document.createElement('a');
        eleLink.download = name;
        eleLink.href = href;
        document.body.appendChild(eleLink);
        eleLink.click();
        eleLink.remove();
    }
const  imageload=()=>{
  downloadByBlob('PngPath','GRN-picture');
  console.log('GRN-picture下载成功！');
}

</script>
<style scoped>
@import '@/assets/base.css';
</style>