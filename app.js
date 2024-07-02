const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const index = require('./routes/index.js');
const home = require('./routes/home.js');
const auth = require('./routes/auth.js');
const courts = require('./routes/courtsRouter.js');

const changeAdminInfo = require('./routes/changeAdminInfo.js');
const overView = require('./routes/overView.js');
const joinYard = require('./routes/joinYard.js');
const saveFrame = require('./routes/saveFrame.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', index);
app.use('/auth', auth);
app.use('/home', home);
app.use('/courts', courts);

app.use('/changeAdminInfo', changeAdminInfo);
app.use('/overView', overView);
app.use('/joinYard', joinYard);
app.use('/saveFrame', saveFrame);

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));
