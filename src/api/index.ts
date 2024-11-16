import Axios from '@/api/axios';
import axios from 'axios';
import { ElMessage } from 'element-plus'
export const FileApi = {
  //绘图
  makeGrn: async (fileName: string, uid: string) => {
    if (!fileName) {
      return Promise.reject(new Error('fileName is required'));
    }
    if (!uid) {
      return Promise.reject(new Error('uid is required'));
    }
    try {
      // return await Axios.post('/adgrn/run?filePath=', { params: data });
      return await Axios.post('/adgrn/run', null, { params: { fileName: fileName, uid: uid } });
    } catch (error) {
      console.error('Error making PNG:', error);
      throw error;
    }
  },
  //拿图
  getGrn: async () => {
    try {
      return await Axios.get('/adgrn/getGRN', { responseType: 'blob' });
    } catch (error) {
      console.error('Error getting PNG:', error);
      throw error;
    }
  },
  //预测病理
  getHealthMess: async (fileName: string, uid: string) => {
    if (!fileName) {
      return Promise.reject(new Error('Data is required'));
    }
    try {
      // return await Axios.post('/adgrn/run?filePath=', { params: data });
      return await Axios.post('/prediction/run', null, { params: { fileName: fileName, uid: uid } });
    } catch (error) {
      console.error('Error getting PNG:', error);
      throw error;
    }
  },
  //获取console日志
  // getConsole: async (data) => {
  //   if (!data) {
  //     return Promise.reject(new Error('Data is required'));
  //   }
  //   try {
  //     // return await Axios.get('/sse/sendMsg', { params: { uid: data } });
  //     return await Axios.post('/adgrn/test', null, { params: { uid: data } })
  //   } catch (error) {
  //     console.error('Error getting PNG:', error);
  //     throw error;
  //   }
  // },
  //上传CSV
  exportCsv: async (fileData) => {
    if (!fileData) {
      return Promise.reject(new Error('Data is required'));
    }
    try {
      const formData = new FormData();
      formData.append('file', fileData); // 这里的 'file' 需要与后端 @RequestParam("file") 中的名称一致
      return await Axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (error) {
      console.error('Error uploadCsv:', error);
      throw new Error('Failed to upload the CSV file');
    }
  },
  //获取测试数据集
  getTestData: async (id: string) => {
    if (!id) {
      ElMessage.error("getTestData_id不存在")
    }
    try {
      return await Axios.get('/prediction/getFileNames', { params: { test_code: id } })
    } catch (error) {
      ElMessage.error("获取数据集失败：", error)
      console.log("获取数据集失败：", error)
    }

  },
  //绘制ROC
  makeROC: async (dataNumber: string, uid: string) => {
    try {
      return await Axios.post('/ROC/test', null, { params: { test_code: dataNumber, uid: uid } })
    } catch (error) {
      console.log("making ROC error:", error)
      throw (error)
    }
  },
  //获得ROC
  getROC: async () => {
    try {
      return await Axios.get('/ROC/getROC', { responseType: 'blob' })
    } catch (error) {
      console.log("getting ROC error:", error)
      throw (error)
    }
  },
  //测试
  TestApi: async (data: string) => {
    return Axios.post('/adgrn/test', null, {
      params: {
        fileName: data
      }
    });
  }
}
