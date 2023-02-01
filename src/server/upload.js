// const http = require("http");
import http from "http";
import multiparty from "multiparty";
// 格式化from表单
// const multiparty = require("multiparty");

const server = http.createServer();

server.on("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.url == "/upload") {
    const multipart = new multiparty.Form();
    multipart.parse(req, async (err, fields, files) => {
      console.log(files);
      if (err) {
        console.log("errrrr", err);
        return;
      }
      const [file] = files.file;
      const [fileName] = fields.fileName;
      const [chunkName] = fields.chunkName;
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
  }
});
server.listen(3000, () => console.log("正在监听 3000 端口"));
