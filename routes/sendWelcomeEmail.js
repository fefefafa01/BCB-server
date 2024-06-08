const nodeMailer = require("nodemailer");

async function sendMail(email) {
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

}

// dùng để test
// sendMail('tung.phamthanh412@hcmut.edu.vn');

export { sendMail };
