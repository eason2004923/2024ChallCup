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
          <ImportFile ref="RefFile_csv" @getFile="getFileMess" />
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
            <img :src="PngPath" alt="无法加载" />
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
// 获取文件
const getFileMess = (tool: any, fPath: any) => {
  console.log(tool, fPath)
  fileName.value = tool.name
  filePath.value = fPath
  progress.value = 25
}
// const submitPath = async () => {
//   try {
//     let res_csv, res_loom, res_tsv

//     if (filePath.value.endsWith('.csv')) {
//       // 提交 CSV 文件
//       res_csv = await FileApi.exportCsv(filePath.value)
//       console.log('CSV Response:', res_csv)

//       // 提交 Loom 文件
//       res_loom = await FileApi.exportLoom(res_csv.data.data)
//       console.log('Loom Response:', res_loom)

//       // 检查 Loom 文件的响应
//       if (res_loom.data && res_loom.data.code === 0) {
//         // 提交 TSV 文件
//         res_tsv = await FileApi.exportTsv(TsvPath.value)
//         console.log('TSV Response:', res_tsv)
//       } else {
//         ElMessage.error('Loom 文件导出失败')
//         return
//       }
//     } else if (filePath.value.endsWith('.loom')) {
//       // 提交 Loom 文件
//       res_loom = await FileApi.exportLoom(filePath.value)
//       console.log('Loom Response:', res_loom)

//       // 检查 Loom 文件的响应
//       if (res_loom.data && res_loom.data.code === 0) {
//         // 提交 TSV 文件
//         res_tsv = await FileApi.exportTsv(TsvPath.value)
//         console.log('TSV Response:', res_tsv)
//       } else {
//         ElMessage.error('Loom 文件导出失败')
//         return
//       }
//     } else {
//       ElMessage.error('不支持的文件类型')
//       return
//     }

//     // 设置 PNG 文件路径
//     PngPath.value = '实际地址' // 这里需要替换为实际的 PNG 文件路径
//   } catch (error) {
//     console.error('Error:', error)
//     ElMessage.error('文件导出失败，请重试')
//   }
// }

const submitPath = async () => {
  try {
    // const res = await FileApi.getPng('d://filetest//2024 challCup//proData//ACT_377_4830.csv')
    const res = await FileApi.getPng('D://filetest//2024_challCup//proData//ACT_377_4830.csv')
    // const res = await FileApi.getTxt()

    alert('1')
    console.log(res)
  } catch (error) {
    console.error('Error getting PNG:', error)
    ElMessage.error('!!!')
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
