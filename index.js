
import express from 'express';
import mongoose from 'mongoose';
import UserModel from './schemas/user.js';


const app = express();
const port = 3000;

app.use(express.json());

main().catch(function (error) { console.log(error) });

async function main() {
    await mongoose.connect('mongodb://localhost:27017/dating_app');

    // Route URL, เมนูในร้าน
    app.get('/', function (request, response) {
        response.send('hello');
    });

    app.post('/users', async function (request, response) {
        console.log(request.body)

        // ปรับแต่่งมาใช้ try/catch เพื่อรองรับกรณีที่ mongoose คืนค่า error ออกมาจากการใช้งาน schema
        let createdUser
        try {

            const newUser = new UserModel(request.body)
            createdUser = await newUser.save()

        } catch (error) {
            // ถ้า error ให้ใส่รหัส 500 และข้อความ error กลับไปที่ client
            response.status(500).json(error.message)
        }


        response.status(200).json(createdUser)
    });

    // /users/1234
    // /users/training@nextflow.in.th
    app.get('/users/:email', async function (request, response) {
        console.log(request.params.email);

        const doc = await UserModel.findOne({ email: request.params.email });

        if (doc) {
            response.json(doc);
        } else {
            response.status(404).send('email not found')
        }

    });

    app.patch('/users', async (request, response) => {
        console.log(request.body)

        // ใช้คำสั่ง updateOne เพื่ออัพเดตข้อมูล
        // สังเกตว่า parameter แรกคือ condition และ parameter ที่ 2 คือค่าที่จะส่งเข้าไปอัพเดต
        await UserModel.updateOne({ email: request.body.email }, request.body)

        response.status(200).send('ok PATCH')


        // ใช้ .findOneAndUpdate แทน ถ้าต้องการ doc กลับมาใช้งานจาก database ด้วย
        // const updatedDoc = await UserModel.findOneAndUpdate({ email: request.body.email }, request.body)
        // response.status(200).send(updatedDoc)
    })

    app.delete('/users', async (request, response) => {
        console.log(request.body.id)

        // เรามีคำสั่่ง .findByIdAndRemove ซึ่งทำให้ง่ายในการระบุ id เพื่อลบ document ออกจาก collection
        await UserModel.findByIdAndRemove(request.body.id)

        response.status(200).send('ok DELETE')
    })

    app.post('/users/login', async (request, response) => {
        console.log(request.body)

        const doc = await UserModel.findOne({ email: request.body.email });

        if (!doc) {
            response.status(404).send('email not found')
            return
        }

        const passValidation = await doc.comparePassword(request.body.password)

        if(passValidation) {
            response.status(200).send('ok PASS')
        } else {
            response.status(401).send('password is not correct')
        }
        
    })


    // เริ่มการทำงาน
    app.listen(port, function () {
        console.log('ตอนนี้เซิฟเวอร์ทำงานอยู่ที่ http://localhost:' + port);
    });
}