// const http = require("http");
import http from "http";
import multiparty from "multiparty";
import path from "path";
import fse from "fs-extra";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.resolve(__dirname, ".", `files`);
const server = http.createServer();
// 合并切片函数
const mergeFun = async (fileName) => {
  // 拿到存储切片的文件路径
  const chunkDir = path.resolve(UPLOAD_DIR, `a.mkv-chunks`);
  // 获取所有切片
  let chunkPaths = await fse.readdir(chunkDir);
  chunkPaths.sort((a, b) => a - b);
  console.log("chunkPaths", chunkPaths);
};
server.on("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.url == "/upload") {
    let multipart = new multiparty.Form();
    multipart.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("errrrr", err);
        return;
      }
      const [file] = files.file;
      const [fileName] = fields.fileName;
      const [chunkName] = fields.index;
      // 保存切片的文件夹的路径
      const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`);
      // // 切片目录不存在，创建切片目录
      if (!fse.existsSync(chunkDir)) {
        await fse.mkdirs(chunkDir);
      }
      // 把切片移动到切片文件夹
      await fse.move(file.path, `${chunkDir}/${chunkName}`);
      res.end(
        JSON.stringify({
          code: 0,
          message: "切片上传成功",
        })
      );
    });
  } else if (req.url == "/merge") {
    mergeFun();
    res.end(
      JSON.stringify({
        code: 0,
        message: "切片合并完成",
      })
    );
  }
});
server.listen(3000, () => console.log("正在监听 3000 端口"));
