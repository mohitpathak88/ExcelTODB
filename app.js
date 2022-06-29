var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var path       = require('path');
var XLSX       = require('xlsx');
var multer     = require('multer');
const Candidate = require('./model/candidate');

//multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
  var upload = multer({ storage: storage });

//connect to db
mongoose.connect('mongodb+srv://testing:hello123@klimb.1xrls.mongodb.net/Klimb?retryWrites=true&w=majority',{useNewUrlParser:true})
.then(()=>{console.log('connected to db')})
.catch((error)=>{console.log('error',error)});

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));

//static folder path
app.use(express.static(path.resolve(__dirname,'public')));
app.listen(3002);



app.get('/',(req,res)=>{
    Candidate.find((err,data)=>{
       if(err){
           console.log(err)
       }else{
           if(data!=''){
               res.render('home',{result:data});
           }else{
               res.render('home',{result:{}});
           }
       }
   });
});

app.post('/',upload.single('excel'),(req,res)=>{
  var workbook =  XLSX.readFile(req.file.path);
  var sheet_namelist = workbook.SheetNames;
  var x=0;
  sheet_namelist.forEach(element => {
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
       Candidate.insertMany(xlData,(err,data)=>{
          if(err){
              console.log(err);
          }else{
              console.log(data);
          }
      })
      x++;
  });
  res.redirect('/');
});
