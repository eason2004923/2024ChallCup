<template>
  <div id="app">
    <header><h1>Diagnosis</h1></header>

    <div class="info">
      <div class="brfore">
        <div class="content-introduction"><p>information………</p></div>
        <div class="content-information">
          <el-button @click="openForm('.csv')" class="upload-button"><span title="CSV文件上传">csv file upload</span></el-button>
          <span class="file-name">{{ fileName }}</span>
          <el-button :plain="true" @click="submitPath" class="submit-button" title="submit出错提示">submit</el-button>
          <br />
          <br />
          <el-button class="button1" @click="drawChart" title="绘图">Description</el-button>
          <ImportFile ref="RefFile_csv" @getFile="getFileName" />
        </div>
      </div>
    </div>

    <div class="flow-path">
      <p title="按钮进度显示">Button progress display:</p>
      <el-progress :percentage="progress" class="el-progress"></el-progress>
      <div class="steps-description">
        <span class="{ show: progress >= 0 }">First step: Upload</span>
        <span class="{ show: progress >= 33 }">Second step: Inference</span>
        <span class="{ show: progress >= 66 }">Third step: Description</span>
      </div>
    </div>

    <div class="content">
      <div class="content-left content-ex">
        <div class="content-left-button">
          <el-button class="button3" @click="drawChart" title="病理等级输出">Pathology Grade Output:</el-button>
        </div>
        <div v-if="pathologyGrade !== null" class="pathology-info">
          <p>病人的病理等级为：{{ pathologyGrade }}</p>
          <p>病理等级介绍：病理等级共有0-4一共五个等级，等级越高表示病情越严重。</p>
        </div>
      </div>
      <div class="content-right content-ex">
        <div class="content-right-bottom">
          <viewer :url="PngPath" ref="viewer">
            <img :src="PngPath" alt="无法加载"   class="viewer-container" @click="openViewer"/>
          </viewer>
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
          <div class="console-input">
            <input type="text" v-model="inputCommand" @keyup.enter="executeCommand" placeholder="Enter command" />
          </div>
        </div>
      </div>


  <el-dialog :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
    <div ref="viewerContainer" class="viewer-container">
      <img :src="PngPath" alt="无法加载" />
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
import { ElMessage, ElNotification, ElProgress ,ElDialog} from 'element-plus'
import ImportFile from './importFile.vue'
import { ref } from 'vue'
import { FileApi } from '@/api/index'
import { ESLint } from 'eslint'
import { errorMessages } from 'vue/compiler-sfc'
import 'viewerjs/dist/viewer.css'
const fileName = ref('The file was not entered')
const filePath = ref('NULL')
const TsvPath = ref('tsv文件地址')
const PngPath = ref('../public/Grn.png')
const RefFile_csv = ref()
const RefFile_loom = ref()
const consoleMessages = ref([])
const pathologyGrade = ref(null) // 添加病理等级响应式数据属性
const progress = ref(0) // 定义进度变量
const dialogVisible = ref(false);
const viewerInstance = ref(null);

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
  RefFile_csv.value.open(tool)
}
// 获取文件名
const getFileName = async (tool) => {
  console.log(tool)
  fileName.value = tool
}
const submitPath = async () => {
  try {
    const res = await FileApi.getGrn(fileName.value); // 上传文件名
    console.log(res);
    ElMessage.success(`正在绘制GRN图`);
    progress.value = 33; // 绘图后进度条前进到1/3
  } catch (error) {
    console.error('Error getting PNG:', error);
    ElMessage.error('Error getting PNG:', error);
  }
};

// 绘图按钮
const drawChart = async () => {
  if (progress.value < 33) {
    ElMessage.warning('Please upload a file first.');
  } else {
    try {
      await submitPath(); // 确保文件上传成功后再继续
      progress.value = 66; // 绘图后进度条更新到66%
      await getpathologygrade(); // 调用获取病理等级的方法
    } catch (error) {
      console.error('绘图失败:', error);
      ElMessage.error('绘图失败');
    }
  }
};

// 定义病理等级的描述
const gradeDescriptions = {
  0: '病理等级为0：无明显病变',
  1: '病理等级为1：轻微病变',
  2: '病理等级为2：中度病变',
  3: '病理等级为3：严重病变',
  4: '病理等级为4：非常严重病变'
}
// 获取病理等级
const getpathologygrade = async () => {
  try {
    // 从服务器获取病理等级
    const response = await fetch('/api/pathology-grade')
    const grade = await response.text() // 服务器返回的纯文本数字
    pathologyGrade.value = gradeDescriptions[1] // 使用映射获取病理等级描述
    progress.value = 100 // 绘图后进度条前进到100%
  } catch (error) {
    console.error('获取病理等级失败:', error)
    ElMessage.error('无法获取病理等级')
  }
}

const openViewer = () => {
  dialogVisible.value = true;
  // 确保viewer.js在DOM元素加载后初始化
  setTimeout(() => {
    if (!viewerInstance.value) {
      viewerInstance.value = new Viewer(document.querySelector('.viewer-container img'), {
        navbar: false,
        toolbar: true,
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
        minZoomRatio: 0.1,
        maxZoomRatio: 10,
      });
    } else {
      viewerInstance.value.update();
    }
  }, 0);
};

const handleClose = () => {
  dialogVisible.value = false;
};
</script>
<style scoped>
@import '../assets/base.css';
</style>