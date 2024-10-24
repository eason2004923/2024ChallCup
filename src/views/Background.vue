<template>
  <div class="background">
    <h1>Background</h1>
    <h2>Clinical Stages of Alzheimer’s</h2>
    <p>
      The seven Clinical Stages of Alzheimer’s disease, also known as the Global Deterioration Scale
      (GDS), was developed by Dr. Barry Reisberg, Director of the Fisher Alzheimer’s Disease
      Education and Research program at NYU Grossman School of Medicine. This guideline is used by
      professionals and caregivers around the world to identify at what stage of the disease a
      person is in. Stages 1-3 are the pre-dementia stages; stages 4-7 are the dementia stages.
      Stage 5 is the point where a person can no longer live without assistance.
    </p>
    <h2>Stage Descriptions</h2>
    <ul>
      <li>STAGE 1: NO DEMENTIA SEEN</li>
      <li>STAGE 2: SUBJECTIVE MEMORY LOSS, AGE RELATED FORGETFULNESS</li>
      <li>STAGE 3: MILD COGNITIVE IMPAIRMENT</li>
      <li>STAGE 4: MODERATE COGNITIVE DECLINE, MILD DEMENTIA</li>
      <li>STAGE 5: MODERATELY SEVERE COGNITIVE DECLINE, MODERATE DEMENTIA</li>
      <li>STAGE 6: SEVERE COGNITIVE DECLINE, MODERATELY SEVERE DEMENTIA</li>
      <li>STAGE 7: VERY SEVERE COGNITIVE DECLINE, SEVERE DEMENTIA</li>
    </ul>
  </div>
  <nav>
    <ul>
      <li><a href="/" title="首页">index</a></li>
      <li><a href="/description" title="辅助诊断AI系统简介">description</a></li>
      <li><a href="/diagnosis" title="数据测试">diagnosis</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Background'
}
</script>

<style scoped>
.background {
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
h2 {
  color: #333;
}

p {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #e7e7e7;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

nav ul {
  text-align: center;
  padding:2rem;
}

nav li {
  display: inline;
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
