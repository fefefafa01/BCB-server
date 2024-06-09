const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.get('/notif', async (req, res) => {
  let { data: notifData, error } = await db
    .from('notification')
    .select('*')
    .order('notification_id', { ascending: true });

  if (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: error.message });
  }

  if (notifData && notifData.length > 0) {
    res.json({ notifData: notifData });
    console.log('Notification found');
  } else {
    res.json({ notifData: [] });
    console.log('No notification');
  }
});

router.get('/news', async (req, res) => {
  const { data: newsData, error } = await db
    .from('news')
    .select('*')
    .order('news_id', { ascending: true });

  if (error) {
    console.error('Error fetching news:', error);
    return res.status(500).json({ error: error.message });
  }

  if (newsData && newsData.length > 0) {
    res.json({ newsData: newsData });
    console.log('Bang Tin found');
  } else {
    res.json({ newsData: [] });
    console.log('No Bang Tin');
  }
});

module.exports = router;
