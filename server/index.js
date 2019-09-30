const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const appData = require('../data.json')
const userData = appData.users

// 创建 application/json 解析
const jsonParser = bodyParser.json()

// 创建 application/x-www-form-urlencoded 解析
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser)

// 设置允许跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})
app.get('/home', (req, res) => {
  res.send('Hello, word !!!')
})
app.get('/user', (req, res) => {
  res.send(userData)
})
app.put('/user', jsonParser, (req, res) => {
  writeJson(req.body).then(result => {
    console.log(result)
    res.send({status: 200, msg: result})
  })
})
app.delete('/user', jsonParser, (req, res) => {
  delJson(req.query.id).then(result => {
    console.log(result)
    res.send({status: 200, msg: result})
  })
})
app.post('/user', jsonParser, (req, res) => {
  console.log(req.body)
  editJson(req.body).then(result => {
    res.send({status: 200, msg: result})
  })
})
app.listen('4200', () => console.log('服务器在4200端口启动了'))

// 启动nodemon server

//写入json文件选项
const writeJson = params => {
  return new Promise((resolve,reject) => {
    //现将json文件读出来
    fs.readFile('./data.json',function(err,data){
      if(err){
        reject(err)
      }
      var person = data.toString();//将二进制的数据转换为字符串
      person = JSON.parse(person);//将字符串转换为json对象
      params.id = person.users.length + 1
      person.users.push(params)
      var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
      fs.writeFile('./data.json',str,function(err){
          if(err){
            reject(err)
          } else {
            console.log(1111)
            resolve('新增成功')
          }
      })
    })
    // resolve('新增成功')
  })
}

//删除json文件选项
const delJson = id => {
  return new Promise((resolve,reject) => {
    //现将json文件读出来
    fs.readFile('./data.json',function(err,data){
      if(err){
        reject(err)
      }
      var person = data.toString();
      person = JSON.parse(person);
      //把数据读出来删除
      for(var i = 0; i < person.users.length;i++){
          if(id == person.users[i].id){
            person.users.splice(i,1);
          }
      }
      console.log(person.users);
      var str = JSON.stringify(person);
      //然后再把数据写进去
      fs.writeFile('./data.json',str,function(err){
          if(err){
            reject(err)
          }
          resolve('删除成功')
      })
    })
  })
}

// 修改
const editJson = parmas => {
  return new Promise((resolve,reject) => {
    //现将json文件读出来
    fs.readFile('./data.json',function(err,data){
      if(err){
        reject(err)
      }
      var person = data.toString();
      person = JSON.parse(person);
      //把数据读出来删除
      for(var i = 0; i < person.users.length;i++){
          if(parmas.id == person.users[i].id){
            person.users.splice(i,1, parmas);
          }
      }
      console.log(person.users);
      var str = JSON.stringify(person);
      //然后再把数据写进去
      fs.writeFile('./data.json',str,function(err){
          if(err){
            reject(err)
          }
          resolve('修改成功')
      })
    })
  })
}
