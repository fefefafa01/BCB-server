const express = require('express');
const router = express.Router();
const db = require('../db/index');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  if (email !== '' && password !== '') {
    // var loginInfo = await db.query(
    //     "Select * from customer where email = $1",
    //     [req.body.email]);
    const { data: loginInfo, error: loginError } = await db
      .from('customer')
      .select('*')
      .eq('email', email);
    if (loginInfo && loginInfo.length > 0) {
      const match = await bcrypt.compare(password, loginInfo[0].password);
      if (match) {
        // if (req.body.password === loginInfo[0].password) {
        res.json({
          loggedIn: true,
          status: 'Successful',
          name: loginInfo[0].name,
          email: email,
          customerId: loginInfo[0].customer_id
        });
      } else {
        res.json({ loggedIn: false, status: 'Wrong Password' });
        console.log('Wrong Password:', password);
      }
    } else {
      const { data: loginInfo, error: loginError } = await db
        .from('admin')
        .select('*')
        .eq('email', email);
      // loginInfo = await db.query(
      //     "Select * from admin where email = $1",
      //     [req.body.email]);
      if (loginError) {
        console.error(loginError);
        return;
      }
      if (loginInfo && loginInfo.length > 0) {
        const match = await bcrypt.compare(password, loginInfo[0].password);
        console.log('match', match);
        if (match) {
          // if (req.body.password === loginInfo[0].password) {
          res.json({
            AdminloggedIn: true,
            status: 'Successful',
            name: loginInfo[0].name,
            email: email
          });
          console.log({ status: 'Successful' });
        } else {
          res.json({ AdminloggedIn: false, status: 'Wrong Password' });
          console.log('Wrong Password:', password);
        }
      } else {
        res.json({ loggedIn: false, status: 'Wrong Email' });
        console.log('Wrong Email:', email);
      }
    }
  }
});

router.post('/resetPwd', async (req, res) => {
  // const resetInfo = await db.query(
  //     `Select * from customer where email = $1`, [
  //         req.body.email
  //     ]);
  const { email, password } = req.body;
  const { data: resetInfo, error: errorReset } = await db
    .from('customer')
    .select('*')
    .eq('email', email);

  if (errorReset) {
    console.error(errorReset);
    return;
  }

  const hashPass = await bcrypt.hash(password, 10);
  if (resetInfo.length > 0) {
    // await db.query(
    //     `update customer set password = $1 where email = $2`,
    //     [hashPass, req.body.email]
    // )
    const { error } = await db
      .from('customer')
      .update({ password: hashPass })
      .eq('email', email)
      .select();
    if (error) {
      console.error(errorReset);
      return;
    }
    res.json({ status: 'Successful', email: email, newPassword: hashPass });
  } else {
    res.json({ status: 'Wrong Email', email: email });
  }
});

module.exports = router;
