const compression = require('compression');
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var router = express();

// router.use(bodyParser({limit: '50mb'}));
router.use(compression());
router.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
router.use(express.static(path.resolve(__dirname, 'public')));


function makeRequest(image_data) {
    // const configHeaders = {
    //     "content-type":"application/json",
    // };
    return axios.post('https://f641f528cc0f.ngrok.io/classify.php', {
      image_data: image_data,
      //headers: configHeaders
      }).then((response) => {
          console.log(response.data);
          //res.json({status: 200, data: 'image received'});
      }, (error) => {
          console.log(error);
      });
}

router.post('/submit', urlencodedParser, function(req) {
    var image_data = req.body.image_data;
    console.log('base64 length: ' + image_data.length);
    fs.writeFile('capture.jpg', image_data.replace(/^data:image\/jpeg;base64,/, ""), 'base64', function (err) {
        console.log(err);
    });

    // axios.post('http://d31bcd08ddd0.ngrok.io', {
    //     image_data: image_data
    // }).then((response) => {
    //     console.log(response.data);
    //     res.json({status: 200, data: 'image received'});
    // }, (error) => {
    //     console.log(error);
    // });
    
    makeRequest(image_data)
    .then((response) => {
        console.log(response);
     })
     .catch(err => console.log("Axios err: ", err))
    
})

var server = router.listen(3000, "0.0.0.0", function() {
    console.table(server.address());
})
