<template>
  <div class="description">
    <h1>Description</h1>
    <h2>Descriptions of STAD-CoAtt:</h2>
    <h3>辅助诊断AI系统简介</h3>
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
  <nav>
    <ul>
      <li><a href="/" title="首页">index</a></li>
      <li><a href="/background" title="背景情况介绍">background</a></li>
      <li><a href="/diagnosis" title="数据测试">diagnosis</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Description'
}
</script>

<style scoped>
.description {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1{
  text-align: center;
  color: #333;
}
h2,
h3 {
  color: #333;
}

p {
  color: #666;
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

nav ul {
  text-align: center;
  padding: 0;
  padding:2rem;
}

nav li {
  display: inline;
  background-color: #e7e7e7;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 10px;
}

nav a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}
</style>
