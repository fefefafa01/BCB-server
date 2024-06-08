const express  = require('express');
const router = express.Router();
const db  = require('../db/index');

router.post('/selectItem', async(req, res) => {
  // const badminton = await db.query(
  //   "Select * From badminton_yard order by yard_id ASC"
  // )
  const { data, error } = await db
    .from("badminton_yard")
    .select("*")

  if (error) {
    console.error(error);
    return;
  }  

  if (data && data.length > 0) {
    res.json({data: data})
  }
})

router.post('/submit', async(req, res) => {
  const { name, address, date, price, linkImg, desc} = req.body
  // await db.query(
  //   `Insert into court_news (name, address, date, price, linkimg, description)
  //           values ($1, $2, $3, $4, $5, $6)`,
  //           [req.body.name, req.body.address, req.body.date, req.body.price, req.body.linkImg, req.body.desc]
  // )
  const { data, error } = await db
    .from("court_news")
    .insert([{ name: name, address: address, date: date, price: price, linkimg: linkImg, description: desc}])
    .select()
  
  if (error) { 
    console.error(error);
    return;
  }  

  if (data && data.length > 0) {
    res.json("Success")
  }
})

router.post('/takeNews', async (req, res) => {
  // const news = await db.query(
  //   "Select * from court_news order by news_id ASC"
  // )
  const { data, error } = await db
    .from("court_news")
    .select("*")
    .order('news_id', {ascending: true })

  if (error) {
    console.error(error);
    return;
  }  

  if (data && data.length > 0) {
    res.json({data: data})
  }
  
})
module.exports = router;