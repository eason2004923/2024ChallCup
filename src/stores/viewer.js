import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css' // 引入样式

export default {
  data() {
    return {
      scale: 1, // 初始缩放比例
      PngPath: '../public/Grn.png' // 初始图片路径
    }
  },
  methods: {
    // 放大图片
    fangda() {
      this.scale += 0.1
    },
    // 缩小图片
    suoxiao() {
      this.scale -= 0.1
    },
    // 初始化图片查看器
    initViewer() {
      this.$nextTick(() => {
        new Viewer(this.$refs.viewer, {
          url: 'data-source',
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
          inline: true,
          loading: true,
          locale: 'zh-CN',
          theme: 'default'
        })
      })
    }
  }
}
