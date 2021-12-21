
import express from 'express';

const app = express();
const port = 3000;

// Route URL, เมนูในร้าน
app.get('/', function(request, response){
    response.send('hello');
});

// เริ่มการทำงาน
app.listen(port, function(){
    console.log('Server run at http://localhost:' + port);
});