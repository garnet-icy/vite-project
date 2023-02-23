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
const pipeStream = (path, writeStream) => {
  console.log("path", path);
  return new Promise((resolve) => {
    const readStream = fse.createReadStream(path);
    readStream.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });
};

const resolvePost = (req) => {
  new Promise((res) => {
    let chunk = "";
    req.on("data", (data) => {
      console.log("data:", data);
      chunk += data;
    });
    req.on("end", () => {
      console.log("chunk:", chunk);
      res(JSON.parse(chunk));
    });
  });
};

// 合并切片函数
const mergeFun = async (filePath) => {
  // 拿到存储切片的文件夹路径
  const chunkDir = path.resolve(UPLOAD_DIR, `a.mkv-chunks`);
  // 获取所有切片
  let chunkPaths = await fse.readdir(chunkDir);
  // 所有切片排序
  chunkPaths.sort((a, b) => a - b);
  console.log("chunkPaths", chunkPaths);
  const arr = chunkPaths.map((chunkPath, index) => {
    return pipeStream(
      path.resolve(chunkDir, chunkPath),
      // 指定位置创建可写流
      fse.createWriteStream(filePath, {
        start: index * size,
        end: (index + 1) * size,
      })
    );
  });
  await Promise.all(arr);
  fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
};
server.on("request", async (req, res) => {
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
    const data = await resolvePost(req);
    const { fileName, size } = data;
    const filePath = path.resolve(UPLOAD_DIR, fileName);
    mergeFun(filePath);
    res.end(
      JSON.stringify({
        code: 0,
        message: "切片合并完成",
      })
    );
  }
});
server.listen(3000, () => console.log("正在监听 3000 端口"));
