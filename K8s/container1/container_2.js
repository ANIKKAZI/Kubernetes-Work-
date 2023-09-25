let express = require('express');
const axios = require('axios');
//let bodyParser = require('body-parser');
const Papa = require('papaparse');
const fs = require('fs');
let app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.post('/store-file',(req,res)=>{
    // let searchedProduct = req.product;
    searchedProduct  =  req.body.product;
    errmsg = null
    let fileMountPath  = '../Anik_PV_dir/'.concat(req.body.file);


    if(!req.body.file){
      resData= {
          "file": null,
          "error": "Invalid JSON input."
      }
      res.send(JSON.stringify({
          "file": null,
          "error": "Invalid JSON input."
      }));
    }
     else{
      let fileMountPath  = '../Anik_PV_dir/'.concat(req.body.file);
       
        fs.writeFile(fileMountPath, req.body.data, (err) => {
            if (err) {
                res.send({
                  file: req.body.file,
                  error: 'Error while storing the file to the storage.'
                })
            } else {
              res.send({
                file: req.body.file,
                message: 'Success.'
              })
            }
        });
    }

    

});
app.post('/calculate',(req,res)=>{
    // let searchedProduct = req.product;
    let apiResult = null;
  
    let fileMountPath  = '../Anik_PV_dir/'.concat(req.body.file);
     if(fs.existsSync(fileMountPath)){
         console.log(req.body + "in first container");
         let secondService = "http://app2/calculate"
         axios.post(secondService,{file: req.body.file,product: req.body.product}).then((result) => {
         apiResult = result.data;
         res.send(JSON.stringify(result.data))
         console.log(result.data+ "it is here");
        }).catch((err) => {
         apiResult = err;
         res.send(JSON.stringify(err));
        });
         //return(apiResult);
     }
     else if(req.body.file === null || req.body.file === ''){
       res.send( {
          "file": null,
         "error": "Invalid JSON input."
      });
     }
     else
     {
         res.send(JSON.stringify({
             "file": req.body.file,
             "error": "File not found."
         }));
     }


    

});





app.listen(80);
console.log('the server is running on the port 80');