import Axios from '@/api/axios';
import axios from 'axios';

export const FileApi = {

  exportLoom: async (data: any) => {
    if (data) {
      return await Axios.post('/adgrn/loom', { data }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }
  },
  exportTsv: async (data: any) => {
    if (data) {
      return await Axios.post('/adgrn/img', { data }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }
  },
  //绘图
  getGrn: async (data) => {
    if (!data) {
      return Promise.reject(new Error('Data is required'));
    }
    try {
      // return await Axios.post('/adgrn/run?filePath=', { params: data });

      return await Axios.post('/prediction/run', null, { params: { fileName: data } });
    } catch (error) {
      console.error('Error getting PNG:', error);
      throw error;
    }
  },
  getHealthMess: async (data) => {
    if (!data) {
      return Promise.reject(new Error('Data is required'));
    }
    try {
      // return await Axios.post('/adgrn/run?filePath=', { params: data });
      return await Axios.post('/prediction/run', { data: data });
    } catch (error) {
      console.error('Error getting PNG:', error);
      throw error;
    }
  },
  exportCsv: async (fileData) => {
    if (!fileData) {
      return Promise.reject(new Error('Data is required'));
    }
    try {
      const formData = new FormData();
      formData.append('file', fileData); // 这里的 'file' 需要与后端 @RequestParam("file") 中的名称一致
      // return await Axios.post('/adgrn/run?filePath=', { params: data });
      return await Axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (error) {
      console.error('Error getting PNG:', error);
      throw error;
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
