const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.get('/', async (req, res) => {
  const { district } = req.query;
  console.log(req.query);
  if (district == '' || district == 'Tất cả') {
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
