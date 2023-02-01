<template>
  <div>
    <input type="file" @change="fileChange" />
    <el-button @click="upload" type="primary">上传</el-button>
  </div>
</template>

<script setup>
// setup语法糖内部不需要return
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
let originFile = ref("");
let chunkList = reactive([]);
let paramsList = reactive([]);
// 拿到文件
const fileChange = (e) => {
  originFile.value = e.target.files[0];
  console.log("e.target: ", e.target.files[0]);
  chunkList.value = getChunkList(originFile.value);
  paramsList.value = chunkList.value.map((item, index) => {
    return {
      index,
      file: item.chunk,
      size: item.chunk.size,
      fileName: originFile.value.name,
    };
  });
  console.log("paramsList", paramsList);
};
// 分片，参数为文件和每片文件的大小
const getChunkList = (file, size = 50 * 1024) => {
  let cur = 0;
  let chunkList = [];
  while (cur < file.size) {
    chunkList.push({ chunk: file.slice(cur, cur + size) });
    cur += size;
  }
  return chunkList;
};
// 进度
const onUploadProgress = (e) => {
  console.error("onUploadProgress", e);
};
// 上传
const upload = () => {
  if (!chunkList.value) {
    ElMessage.error("请先选择文件");
    return;
  }
  axios.defaults.baseURL = "http://localhost:3000";
  axios
    .post(
      "/upload",
      paramsList.value[0],
      { "content-type": "application/json" },
      onUploadProgress
    )
    .then((response) => {
      console.error("response: ", response);
    });
  // paramsList.value.forEach((item) => {});
};
</script>

<style></style>
