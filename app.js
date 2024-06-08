const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const index = require('./routes/index.js');
const usersRouter = require('./routes/users.js');
const loginRouter = require('./routes/login.js');
const registerRouter = require('./routes/register.js');
const notifRouter = require('./routes/notif.js');
const bangtinRouter = require('./routes/bangtin.js');
const listOfCourtRouter = require('./routes/listOfCourt.js');
const changeAdminInfo = require('./routes/changeAdminInfo.js');
const overView = require('./routes/overView.js');
const CourtDetail = require('./routes/CourtDetail');
const joinYard = require('./routes/joinYard.js');
const saveFrame = require('./routes/saveFrame.js');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', index);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/notif', notifRouter);
app.use('/bangtin', bangtinRouter);
app.use('/listOfCourt', listOfCourtRouter);
app.use('/changeAdminInfo', changeAdminInfo);
app.use('/overView', overView);
app.use('/CourtDetail', CourtDetail);
app.use('/joinYard', joinYard);
app.use('/saveFrame', saveFrame);

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));
