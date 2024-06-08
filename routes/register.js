const express = require('express');
const router = express.Router();
const db = require('../db/index');
const nodeMailer = require("nodemailer");
const bcrypt = require('bcrypt');

router.post('/', async(req, res) => {
    // console.log(req.body);
    const { email, name, password} = req.body;
    console.log({ email, name, password });
    const { data:regInfo, error:regError } = await db.from('customer').select('*').eq('email', email)
    // const regInfo = await db.query(
    //     "Select * from customer where email = $1",
    //     [req.body.email]);
    if (regError) {
        console.error(regError)
        return;
    }
    if ( regInfo && regInfo.length > 0) {
        res.json({ registered: false, status: 'Email Exist'})
        console.log("Email Exist", email)
    }
    else{
        const hashedPass = await bcrypt.hash(password, 10)

        //gửi thông báo đã đăng kí thành công tới email khách hàng
        const username = email.split('@')[0];

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Xác nhận đăng ký thành công</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
        
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                h1 {
                    color: #4CAF50;
                }
        
                p {
                    font-style: italic;
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Xin chào <span style="color: #2196F3;">${username}</span> từ BCB (Badminton Court Booking)</h1>
                <p>Chúng tôi muốn chúc mừng bạn đã đăng ký thành công và chào mừng bạn đến với chúng tôi.</p>
                <img src="https://images-na.ssl-images-amazon.com/images/I/81ijQBtGBYL._AC_SL1500_.jpg" alt="Image description" style="width:550px; height: auto; ">
            </div>
        </body>
        </html>    
    `;
    
    
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'hcmutbcb@gmail.com',
                pass: 'ivzq lche cinx mfvl'
            }
        })
    
        const info = await transporter.sendMail({
            from: 'hcmutbcb@gmail.com',
            to: email,
            subject: 'Xác nhận đăng kí vào BCB thành công',
            html: html,
        })
    
        console.log("Message sent: " + info.messageId);
        //kết thúc gửi thông báo đã đăng kí thành công tới email khách hàng

        const { data: createNewCustomer, error: errorCreate } = await db
                .from('customer')
                .insert([
                    { name: name, email: email, password: hashedPass },
                ])
                .select();
        if (errorCreate) {
            console.error(errorCreate);
            return;
        }        
        console.log(createNewCustomer)
        // const createNewCustomer = await db.query(
        //     `insert into customer (name, customer_id, email, password, created_date)
        //     values ($1, $2, $3, $4, CURRENT_DATE)`,
        //     [req.body.name, checkid, req.body.email, hashedPass]
        // );
        res.json({ registered: true, status: "Successful"});
        console.log("Successful");
    }     
});

module.exports = router;