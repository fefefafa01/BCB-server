const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.post('/', async (req, res) => {
  const { district } = req.body;
  // if(req.body.district) {
  //     res.json({ hap: true, status: "Successful"});
  // }
  if (district == '' || district == 'Tất cả') {
    // var yardInfo = await db.query(
    //     "Select * from badminton_yard");
    const { data: yardInfo, error: errorYard } = await db.from('badminton_yard').select('*');

    if (errorYard) {
      console.error(errorYard);
      return;
    }

    if (yardInfo && yardInfo.length > 0) {
      console.log('Court found');
      res.json({ data: yardInfo, status: 'Successful' });
    } else {
      console.log('No Court found');
      res.json({ data: [], status: 'Failed' });
    }
  } else {
    // var yardInfo = await db.query(
    //     "Select * from badminton_yard where address like $1",
    //     '%'+[req.body.district] + '%');
    const { data: yardInfo, error: errorYard } = await db
      .from('badminton_yard')
      .select('*')
      .like('address', `%${district}%`);

    if (errorYard) {
      console.error(errorYard);
      return;
    }
    if (yardInfo.length > 0) {
      console.log('Court found');
      res.json({ data: yardInfo, status: 'Successful' });
    }
  }
});

module.exports = router;
