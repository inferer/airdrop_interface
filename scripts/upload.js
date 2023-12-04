const fs = require("fs");
const path = require("path");
const COS = require("cos-nodejs-sdk-v5");
//上面封装的遍历目录方法
const fileDisplay = require("./fileDisplay");
const config = require('../cos.config.json');
const uploadKeys = require('./uploadKeys.json');
//2.1拿到的密钥
const cos = new COS({
  SecretId: config.SecetId,
  SecretKey: config.SecretKey,
});
/* 存储桶名称 */
const bucket = "website-1315068501";
/* 存储桶所在地域 */
const region = "ap-nanjing";

// 需要上传的文件夹地址
const filePath = path.resolve("public/images");

// 批量删除文件，先查后删
const deleteOldFile = () => {
  return new Promise((resolve) => {
    cos.getBucket(
      {
        Bucket: bucket,
        Region: region,
        Prefix: "static/", //要清理的目录
        Marker: "static/", //要清理的目录
        MaxKeys: 1000,
      },
      function (listError, listResult) {
        if (listError) return console.log("list error:", listError);
        var objects = listResult.Contents.map(function (item) {
          return { Key: item.Key };
        });
        if (objects.length) {
          cos.deleteMultipleObject(
            {
              Bucket: bucket,
              Region: region,
              Objects: objects,
            },
            function (delError, deleteResult) {
              if (delError) {
                console.log(delError);
              }
              if (deleteResult?.statusCode === 200) {
                console.log("清理原static目录成功！");
                resolve();
              }
            }
          );
        } else {
          console.log("目录下无资源，无需删除！");
          resolve();
        }
      }
    );
  });
};

//单个上传文件
let tempKeys = [...uploadKeys]
const uploadFile = (pathItem) => {
  return new Promise((resolve) => {
    const uploadKey = `airdrop_interface/${pathItem.split("/public/")[1]}`;
    if ((uploadKeys || []).find(key => key === uploadKey)) {
      console.log(`${uploadKey} 已上传到CDN！`);
      resolve(true)
      return
    }
    tempKeys.push(uploadKey);
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: uploadKey, //上传到 存储桶 的路径 *
        StorageClass: "STANDARD",
        Body: fs.createReadStream(pathItem), // 被上传的 文件对象
      },
      function (err, data) {
        if (data?.statusCode === 200) {
          console.log(`上传${uploadKey}到cdn成功！`);
          fs.writeFileSync(path.resolve(__dirname, 'uploadKeys.json'), JSON.stringify(tempKeys), 'utf-8');
          resolve(true)
        }
      }
    );
  })
  
};

const playUpload = async () => {
  // 先删除原来的static
  // await deleteOldFile();
  // 获取即将上传的所有文件路径
  const fileData = await fileDisplay(filePath);
  // // 开始逐一上传
  await Promise.resolve(fileData.forEach(async (item) => {
    await uploadFile(item);
  })) 
};

playUpload();

