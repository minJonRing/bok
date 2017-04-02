var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var session = require('express-session')
var fs = require('fs')
var multer  = require('multer')
var formidable = require('formidable')


mongoose.connect('mongodb://localhost:27017/qh')
console.log('info')

var index = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/router');


// var upload = multer({
//   storage: storage
// }).single('image');

var app = express();



var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,path.join(__dirname, './dist/upload'))
  },
  filename: function(req,file,cd){
      var fileFormat = (file.originalname).split(".");
      cd(null, file.fieldname + '-' + Date.now() + "." + file.originalname.split('.')[1])
  }
})
// var upload = multer({dest:path.join(__dirname, 'public/upload')})
var upload = multer({storage:storage})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './dist')));
app.use(session({
	secret:'12345',
  name:'user',
	cookie:{maxAge:1000*3600*24},
	resave:true,
	saveUninitialized:false
}))


app.all('*',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next()
})
// app.use('/', index);
// app.use('/users', users);
app.get('*',function(req,res){
  const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'),'utf-8')
  res.send(html)
})
// app.post('/api/adduserinfo',upload.single('image'),function(req,res,next){
//   console.log(req.body.user)
//   var url = req.file.path.split("\\")
//   var img = url[url.length-2]+"\\"+url[url.length-1]
//   res.send(img)
// })
// app.post('/api/adduserinfo',formparse())
// app.post('/api/adduserinfolll', function(req, res, next) {
//   console.log(req.body.state)
  // var form = new formidable.IncomingForm();   //创建上传表单
  //   form.encoding = 'utf-8';    //设置编辑
  //   form.uploadDir = path.join(__dirname, 'public/upload')  //设置上传目录
  //   form.keepExtensions = true;  //保留后缀
  //   form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

  // form.parse(req, function(err, fields, files) {

    // if (err) {
    //   res.locals.error = err;
    //   res.render('index', { title: TITLE });
    //   return;   
    // }  
     
    // var extName = '';  //后缀名
    // switch (files.type) {
    //   case 'image/pjpeg':
    //     extName = 'jpg';
    //     break;
    //   case 'image/jpeg':
    //     extName = 'jpg';
    //     break;     
    //   case 'image/png':
    //     extName = 'png';
    //     break;
    //   case 'image/x-png':
    //     extName = 'png';
    //     break;     
    // }

    // if(extName.length == 0){
    //     res.locals.error = '只支持png和jpg格式图片';
    //     res.render('index', { title: TITLE });
    //     return;          
    // }

  //   var avatarName = Date.now()
  //   var newPath = form.uploadDir + avatarName;
  //   console.log(avatarName)
  //   console.log(newPath);
  //   console.log(files.image.path)
  //   // fs.renameSync(files.image.path, newPath);  //重命名
  // });
//   res.send(200);    
// });
app.use(home);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
