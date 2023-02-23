<template>
  <div>
    <input type="file" @change="fileChange" />
    <el-button @click="upload" type="primary">上传</el-button>
    <el-button @click="mergeFile" type="success">合并</el-button>
    <!-- <el-progress v-for="item in fileProgress"></el-progress> -->
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
axios.defaults.baseURL = "http://localhost:3000";
// 拿到文件
const fileChange = (e) => {
  originFile.value = e.target.files[0];
  chunkList.value = getChunkList(originFile.value);
  paramsList.value = chunkList.value.map((item, index) => {
    let data = new FormData();
    data.append("index", index);
    data.append("file", item.chunk);
    data.append("size", item.chunk.size);
    data.append("fileName", originFile.value.name);
    return data;
  });
  console.log("paramsList", paramsList);
};
// 分片，参数为文件和每片文件的大小
const getChunkList = (file, size = 10000 * 1024) => {
  let cur = 0;
  let chunkList = [];
  while (cur < file.size) {
    chunkList.push({ chunk: file.slice(cur, cur + size) });
    cur += size;
  }
  return chunkList;
};
// 进度
const onUploadProgressCb = (e) => {
  console.error("onUploadProgressCb", e);
};
// 上传
const upload = async () => {
  if (!chunkList.value) {
    ElMessage.error("请先选择文件");
    return;
  }
  axios.defaults.baseURL = "http://localhost:3000";
  await Promise.all(
    paramsList.value.map((i) => {
      return axios.post("/upload", i, {
        onDownloadProgress: function (progressEvent) {
          // 处理原生进度事件
          let persent =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0; //上传进度百分比
          console.log(persent);
        },
      });
    })
  )
    .then((response) => {
      console.log("response: ", response);
      ElMessage.success("上传成功");
    })
    .catch((e) => {
      console.log(e);
    });
};
const mergeFile = () => {
  axios.post("/merge").then((res) => {
    console.log(res);
  });
};
</script>

<style></style>
