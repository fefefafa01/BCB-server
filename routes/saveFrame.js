const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { date, slots, yard_id, total_cost, user_id } = req.body;
  try {
    let description = date + slots[0].name + slots[0].time + yard_id;
    const { data: payment, error: insertPaymentError } = await db
      .from('payment')
      .insert({
        customer_id: user_id,
        total_cost: total_cost, // Giả sử date là một biến chứa ngày tháng
        payment_description: description
      })
      .select();
    if (insertPaymentError) {
      console.error('Error inserting data:', insertPaymentError);
    }

    console.log(payment);

    for (const slot of slots) {
      var temp = slot.name.split(' ');
      const courtNum = parseInt(temp[1], 10); // Chuyển đổi chuỗi thành số nguyên với cơ số 10
      temp = slot.time.split(':');
      const time_slot = parseInt(temp[0], 10);

      // Giả sử yard_id và courtNum là các biến đã được cung cấp
      const { data: courts, error: courtError } = await db
        .from('court')
        .select('court_id')
        .eq('yard_id', yard_id)
        .eq('court_num', courtNum)
        .single(); // Sử dụng single() nếu bạn mong đợi chỉ một bản ghi trả về

      if (courtError) {
        console.error('Error fetching court ID:', courtError);
        return; // Xử lý lỗi hoặc trả về thông báo lỗi
      }

      const court_id = courts.court_id; // Giả sử chỉ một bản ghi được trả về
      const frame_desc = court_id + date + time_slot;
      const { data: frame, error: insertError } = await db
        .from('frame')
        .insert({
          frame_desc: frame_desc,
          court_id: court_id,
          time_frame: date, // Giả sử date là một biến chứa ngày tháng
          time_slot: time_slot // Giả sử time_slot là một biến chứa thông tin về khung giờ
        })
        .select();
      if (insertError) {
        console.error('Error inserting data:', insertError);
      }
      const { error: insertErrorBooking } = await db.from('booking').insert({
        frame_id: frame[0].frame_id,
        payment_id: payment[0].payment_id,
        payment_desc: payment[0].payment_description
      });
      if (insertErrorBooking) {
        console.error('Error inserting data:', insertErrorBooking);
      }
    }
    res.json({ status: 'Successful' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ status: 'Failed' });
  }
});

module.exports = router;
