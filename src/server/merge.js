// import fse from "fs-extra";
// import path from "path";
// import { fileURLToPath } from "url";
const fse = require("fs-extra");
const path = require("path");
const url = require("url");
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// 切片文件夹位置
const MERGE_DIR = path.resolve(__dirname, "files");
console.log("MERGE_DIR: ", MERGE_DIR);
const mergeFile = async () => {
  // 获取所有切片文件的文件夹
  const chunkDir = path.resolve(
    MERGE_DIR,
    "微信图片_20220609155034.png-chunks"
  );
  // 读取切片文件夹下所有内容
  let chunks = await fse.readdir(chunkDir);
  console.log("chunks: ", typeof chunks);
  await mergeChunks(chunks, filePath, size);
};
mergeFile();
exports.name = MERGE_DIR;
// module.exports = {
//   MERGE_DIR
// }
console.log("module: ", module);
const mergeChunks = () => {};
