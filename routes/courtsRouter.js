const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.get('/courtsList', async (req, res) => {
  const { district } = req.query;
  if (district == '' || district == 'Tất cả') {
    const { data: yardInfo, error: errorYard } = await db.from('badminton_yard').select('*');

    if (errorYard) {
      console.error(errorYard);
      return;
    }

    if (yardInfo && yardInfo.length > 0) {
      res.json({ data: yardInfo, status: 'Successful' });
    } else {
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
      res.json({ data: yardInfo, status: 'Successful' });
    }
  }
});

router.get('/courtDetail', async (req, res) => {
  const { item, date } = req.query;
  const { data: courtIds, error: errorCourt } = await db
    .from('court')
    .select('court_id, court_num')
    .eq('yard_id', item.yard_id);
  if (errorCourt) {
    console.error(errorCourt);
    return;
  }
  const { data: bookedData, error: bookedError } = await db
    .from('booking_court')
    .select(`timeslot, court:court_id (court_id, yard_id, court_num)`)
    .eq('court.yard_id', item.yard_id)
    .eq('date', date);
  if (bookedError) {
    console.error(bookedError);
    return;
  }

  if (courtIds && courtIds.length > 0) {
    res.json({ courts: courtIds, bookedData: bookedData, status: 'Successful' });
  }
});

router.get('/bookingSave', async (req, res) => {
  const { slot, user_id, date } = req.query;
  const { court_id, time } = slot;

  const { data: checkingData, error: checkingError } = await db
    .from('booking_court')
    .select('*')
    .eq('court_id', court_id)
    .eq('date', date)
    .eq('timeslot', time);
  if (checkingError) {
    console.error(checkingError);
    return;
  }
  if (checkingData && checkingData.length > 0) {
    res.json({ status: 'Sân đã được đặt', booked: false });
  } else {
    const { data: bookingData, error: bookingError } = await db
      .from('booking_court')
      .insert([
        {
          user_id: user_id,
          court_id: court_id,
          date: date,
          timeslot: time
        }
      ])
      .select();
    if (bookingError) {
      console.error(bookingError);
      return;
    }
    if (bookingData) {
      res.json({ status: 'Successful', booked: true });
    }
  }
});

router.get('/bookingCancel', async (req, res) => {
  const { slot, date } = req.query;
  const { court_id, time } = slot;

  const { error: deleteError } = await db
    .from('booking_court')
    .delete()
    .eq('court_id', court_id)
    .eq('date', date)
    .eq('timeslot', time);
  if (deleteError) {
    console.error(deleteError);
    return;
  } else {
    res.json({ status: 'Successful', deleted: true });
  }
});

module.exports = router;
