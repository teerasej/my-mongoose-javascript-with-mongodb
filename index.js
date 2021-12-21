
import express from 'express';
import mongoose from 'mongoose';
import UserModel from './schemas/user.js';


const app = express();
const port = 3000;

app.use(express.json());

main().catch(function(error){ console.log(error) });

async function main() {
    await mongoose.connect('mongodb://localhost:27017/dating_app');

    // Route URL, เมนูในร้าน
    app.get('/', function (request, response) {
        response.send('hello');
    });

    app.post('/users', async function(request, response){
        console.log(request.body);

        // const newUser = new UserModel(request.body);
        const newUser = new UserModel({
            email: request.body.email,
            password: request.body.password
        });

        const doc = await newUser.save()
        
        response.json(doc);
    });

    // /users/1234
    // /users/training@nextflow.in.th
    app.get('/users/:email', async function(request, response){
        console.log(request.params.email);

        const doc = await UserModel.findOne({ email: request.params.email });

        if(doc) {
            response.json(doc);
        } else {
            response.status(404).send('email not found')
        }
        
    });



    // เริ่มการทำงาน
    app.listen(port, function () {
        console.log('ตอนนี้เซิฟเวอร์ทำงานอยู่ที่ http://localhost:' + port);
    });
}