<template>
  <header>
      <h3>STAD-CoAtt</h3>
      <ul>
        <li><a href="/diagnosis" title="数据测试">Diagnosis</a></li>
        <li><a href="/description" title="辅助诊断AI系统简介">Description</a></li>
        <li><a href="/background" title="背景情况介绍">Background</a></li>
        <li><a href="/" title="首页">Index</a></li>
      </ul>
  </header>
  <!-- <header1>
  <div class="logo">
    <a href="#">Company Name</a>
  </div>
  <nav>
    <div class="nav-responsive"><a id="nav-toggle" href="/"><span></span></a></div>
    <ul class="navlist">
      <li><a>Home</a></li>
      <li><a>Something</a></li>
      <li><a>other</a></li>
      <li><a>About</a></li>
      <li><a>Contact</a></li>
    </ul>
  </nav>
</header1> -->
  <div class="description">
    <h1>Descriptions of STAD-CoAtt</h1>
    <p>
      Single-nucleus RNA sequencing(snRNA-seq) data provide valuable insights about disease
      progression of neurodegeneration. During assessment of Alzheimer's disease(AD), conventional
      deep learning methods generally focus on temporal features of RNA-seq data, while ignoring
      spatial features. Such spatial features including gene networks could play a positive role in
      boosting model performance. In order to exploit structure information about evolving gene
      graphs, spatiotemporal graph learning approach was applied to analyze structure disorder and
      disorganization of regulatory systems that govern disease states. Based on brain
      transcriptomics data, this study proposes a multi-view GCN model, which integrates changes of
      transcript level and gene graphs to evaluate neuropathological stages. Under the framework of
      spatiotemporal graph learning, the proposed STAD-CoAtt method constructs joint
      spatiotemporal(ST) representations of brain snRNA-seq data, to predict AD Braak stages.
    </p>
    <img src="/public/image/image.png" alt="STAD-CoAtt方法的框架" class="framework-image" />
    <h2>The framework of STAD-CoAtt method.</h2>
  </div>
  <footer>
      <ul>
        <li><a href="/" title="首页">Index</a></li>
        <li><a href="/background" title="背景情况介绍">Background</a></li>
        <li><a href="/diagnosis" title="数据测试">Diagnosis</a></li>
      </ul>
      <p>Copyright © 2024.zstu.digital medicine All rights reserved.</p>
    </footer>
</template>

<script>
export default {
  name: 'Description',
  data() {
    return {
      isNavVisible: false,
      isNavActive: false,
      navLinks: [
        { text: 'Home', active: false },
        { text: 'About', active: false },
        { text: 'Services', active: false },
        { text: 'Contact', active: false },
      ],
      logoColor: '#fff',
    };
  },
  methods: {
    toggleNav() {
      this.isNavVisible = !this.isNavVisible;
      this.isNavActive = !this.isNavActive;
    },
    setActiveLink(link) {
      this.navLinks.forEach((lnk) => lnk.active = false);
      link.active = true;
    },
  },
};
</script>

<style scoped>
header{
  background-color: #333;
  display: flex;
}
header ul{
  flex: 1;
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
header li {
  float: right;
}
header a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}
header a:hover {
  background-color: #111; 
  color: #e0ee8b;
}
header::after {
  content: "";
  clear: both;
  display: table;
}
header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}
header h3 {
  flex: 1;
  float: left;
  color: white;
  padding: 14px 16px;
  margin: 0;
  font-size: 18px;
}

.description {
  max-width: 800px;
  margin: auto;
  margin-top: 75px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1{
  text-align: center;
  color: #333;
  font-size: 2rem;
}

p {
  color: #363636;
  font-size: 16px;
  line-height: 1.6;
}

.framework-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2{
  text-align: center;
  font-size: 1.2rem;
}

/*footer区显示*/
footer {
  margin-top: 20px;
  background-color: #314584;
  color: white;
  text-align: center;
  padding: 20px 20px;
}

footer ul {
  list-style: none;
  padding: 0;
  margin: 0 auto; /* 将列表居中 */
  display: flex;
  justify-content: center; /* 使列表项居中对齐 */
  margin-bottom: 10px;
}

footer ul li {
  margin: 0 10px; /* 为每个列表项添加左右外边距 */
}

footer ul li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

footer ul li a:hover {
  color: #e0ee8b;
}

footer p {
  font-size: 0.85em;
  margin-top: 20px;
  color: #cccccc;
}
</style>
