let express = require('express');
//let bodyParser = require('body-parser');
const Papa = require('papaparse');
const fs = require('fs');
let app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let errmsg = null
let searchedProduct;
let amountCount = 0;
const parseConfig = {
  beforeFirstChunk: function (chunk) {
    const headers = Papa.parse(chunk, {
      delimiter: ',',
      preview: 1,
      skipEmptyLines: true,
    }).data[0];

    if (headers.length !== 2) {
      //throw new Error('Expected exactly two headers, but found ' + headers.length);
      //throw new Error('Expected exactly two headers, but found ' + headers.length);
        errmsg = 'Input file not in CSV format.';
    }

    const rows = Papa.parse(chunk, {
      delimiter: ',',
      preview: 0,
      skipEmptyLines: true,
    }).data;

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      // console.log()
      if (values.length > 2) {
       // throw new Error('Expected exactly two values in row ' + (i + 1));
        errmsg = 'Input file not in CSV format.'
      }
      if (values.length != 2) {
        // throw new Error('Expected exactly two values in row ' + (i + 1));
         errmsg = 'Input file not in CSV format.'
       }
    }




  },
  // delimiter: ',',
  header: true,
  dynamicTyping: true,
  // type: {
  //   header1:'string',
  //   header2: 0,
  // },

  transformHeader: function (header, columnIndex) {
    if (columnIndex === 1) {
      if (header.toLowerCase() === 'amount') {
        return 'amount';  // Return the header as is
      } else {
        //throw new Error('Invalid column header for amount');
        errmsg='Input file not in CSV format.'
      }
    }
    if (columnIndex === 0) {
      if (header.toLowerCase() === 'product') {
        return 'product';  // Return the header as is
      } else {
        //throw new Error('Invalid column header for product');
        errmsg = 'Input file not in CSV format.'
      }
    }
    return header;
  },
  transform: function (value, header, rowIndex) {
    if (header.toLowerCase() === 'amount') {
      if (isNaN(value)) {
      //  throw new Error('Invalid value for amount: ' + value);
        errmsg = 'Input file not in CSV format.'
      }
      return parseInt(value);
    }

    if (header.toLowerCase() === 'product') {
      //console.log(typeof (value))
      if (typeof (value) !== 'string' || !isNaN(value)) {
       // throw new Error('Invalid value for product: ' + value);
        errmsg = 'Input file not in CSV format.'
      }
    }
    return value;
  },

  complete: function (results) {
    let rows = results.data
    amountCount = 0
    rows.forEach((row) => {
      console.log(row.amount)
      if(isNaN(row.amount))
      {
        errmsg="Input file not in CSV format."
      }
      // Process the valid row data
      if(row.product === searchedProduct){
        amountCount = amountCount + row.amount;
        console.log(amountCount)
      }
    });
  },
  error: function (error) {
    console.error('Input file not in CSV format.', error);
  },
};








app.post('/calculate',(req,res)=>{
    // let searchedProduct = req.product;
    searchedProduct  =  req.body.product;
    errmsg = null
    let fileMountPath  = '../Anik_PV_dir/'.concat(req.body.file);
    if(req.body.file){
      if(fs.existsSync(fileMountPath)){
        fs.readFile(fileMountPath, 'utf8', (err, fileData) => {
          let resultString =  fileData.replace(/\s/g, '');
            let updatedFileData = fileData.replace(/[^\S\n]/g, '');
            const parsedData = Papa.parse(updatedFileData, parseConfig);
            if(isNaN(amountCount)){
              errmsg="Input file not in CSV format."
            }
            if(errmsg){
              req.body.file
                res.send( {
                  "file": req.body.file,
                  "error": "Input file not in CSV format."
              });
            }
            else
            {
              res.send(JSON.stringify({
                  "file": req.body.file,
                  "sum": amountCount.toString()
              }));
            }
          });
     }
      else
    {
        res.send(JSON.stringify({
            "file": req.body.file,
            "error": "File not found."
        }));
     }
    }
    else{
      res.send( {
        "file": null,
        "error": "Invalid JSON input."
    });
    }

    

});
app.listen(80);
console.log('the server is running on the port 80');