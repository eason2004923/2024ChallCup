<template>
  <div id="app">
    <header>
      <div>
        <h1>中枢神经预警与诊疗辅助决策系统</h1>
      </div>
    </header>

    <div class="info">
      <div class="brfore">
        <div class="content-introduction">information………</div>
        <div class="content-information">
          <el-button @click="openForm('.csv')"><span>csv文件upload</span></el-button>
          <span>{{ fileName }}</span>
          <br />
          <br />
          <el-button :plain="true" @click="submitPath">submit</el-button>
          <el-button class="button1" @click="drawChart">绘图</el-button>
          <ImportFile ref="RefFile_csv" @getFile="getFileName" />
        </div>
      </div>
    </div>

    <div class="flow-path">
      <p>按钮进度显示：</p>
      <el-progress :percentage="progress" class="el-progress"></el-progress>
      <div class="steps-description">
        <div class="steps-description">
          <span class="{ show: progress >= 0 }">First step: Upload</span>
          <span class="{ show: progress >= 25 }">Second step: Inference</span>
          <span class="{ show: progress >= 50 }">Third step: Description</span>
          <span class="{ show: progress >= 75 }">Forth step: Visualize</span>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content-left content-ex">
        <div class="content-left-button">
          <el-button class="button3" @click="drawChart">病理等级输出：</el-button>
        </div>
        <div v-if="pathologyGrade !== null" class="pathology-info">
          <p>病人的病理等级为：{{ pathologyGrade }}</p>
          <p>病理等级介绍：病理等级共有0-4一共五个等级，等级越高表示病情越严重。</p>
        </div>
      </div>
      <div class="content-right content-ex">
        <div class="content-right-bottom">
          <viewer :url="PngPath" ref="viewer">
            <!-- <img :src="PngPath" alt="无法加载" /> -->
            <img src="http://121.41.52.142:5090/path/on/server/data/GRN.png" alt="GRN Image">
          </viewer>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content-left content-ex">
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

      <div class="content-right">
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
import '../stores/viewer'
import { ElMessage, ElNotification, ElProgress } from 'element-plus'
import Menu from './Menu.vue'
import ImportFile from './importFile.vue'
import { ref } from 'vue'
import { FileApi } from '@/api/index'
import { ESLint } from 'eslint'
import { errorMessages } from 'vue/compiler-sfc'
const fileName = ref('未输入文件')
const filePath = ref('NULL')
const TsvPath = ref('tsv文件地址')
const PngPath = ref('../public/Grn.png')
const RefFile_csv = ref()
const RefFile_loom = ref()
const consoleMessages = ref([])
const pathologyGrade = ref(null) // 添加病理等级响应式数据属性

const executeCommand = () => {
  // 这里可以添加执行命令的逻辑
  console.log(inputCommand.value)
  // 假设我们只是打印到console台
  consoleMessages.value.push(`> ${inputCommand.value}`)
  inputCommand.value = ''
}

const inputCommand = ref('')
const progress = ref(0) // 定义进度变量
//打开弹窗
const openForm = (tool: string) => {
  RefFile_csv.value.open(tool)
}
// 获取文件名
const getFileName = async (tool) => {
  console.log(tool)
  fileName.value = tool
}
//绘制GRN图片
const submitPath = async () => {
  try {
    const res = await FileApi.getGrn(fileName.value)//上传文件名
    console.log(res)
    ElMessage.success(`正在绘制GRN图`)
  } catch (error) {
    console.error('Error getting PNG:', error)
    ElMessage.error('Error getting PNG:', error)
  }
}
// 绘图按钮
const drawChart = () => {
  progress.value = 50 // 绘图后进度条前进到1/2
  getpathologygrade() // 调用获取病理等级的方法
}

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
  } catch (error) {
    console.error('获取病理等级失败:', error)
    ElMessage.error('无法获取病理等级')
  }
}

// 模型按钮
const loadModel = () => {
  progress.value = 75 // 绘图后进度条前进到3/4
}
</script>

<style scoped>
@import '../assets/base.css';
</style>
