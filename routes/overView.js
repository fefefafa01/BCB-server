const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.post('/count', async (req, res) => {
  // const countClient = await db.query(
  //   "Select * From customer"
  // )
  const { data: countClient, error: errorCountClient } = await db.from('customer').select('*');
  // const countPayment = await db.query(
  //   "Select * From payment"
  // )
  const { data: countPayment, error: errorPayment } = await db.from('payment').select('*');

  // const countCourt = await db.query(
  //   "Select * From court"
  // )
  const { data: countCourt, error: errorCountCourt } = await db.from('court').select('*');

  res.json({ client: countClient.length, payment: countPayment.length, court: countCourt.length });
});

router.post('/table', async (req, res) => {
  // const table = await db.query(
  //   "SELECT customer_id, name, email, password, TO_CHAR(created_date, 'DD/MM/YYYY') AS created_date FROM customer ORDER BY customer_id ASC"
  // )
  const { data: table, error: errorTable } = await db
    .from('customer')
    .select('customer_id, name, email, password, created_date')
    .order('customer_id', { ascending: true });

  if (errorTable) {
    console.error(errorTable);
    return;
  }
  if (table && table.length > 0) {
    res.json({ table: table });
  }
});

router.post('/changeUser', async (req, res) => {
  console.log(req.body);
  const { email, nameChanged, emailChanged } = req.body;

  if (email != emailChanged) {
    const { data: findUser, error: findError } = await db
      .from('customer')
      .select('*')
      .eq('email', emailChanged);
    if (findError) {
      console.error(findError);
      return;
    }

    if (findUser.length == 0) {
      const { data: checkExistance, error: errorExistance } = await db
        .from('customer')
        .select('*')
        .eq('email', email);
      if (errorExistance) {
        console.error(errorExistance);
        return;
      }
      if (checkExistance.length > 0) {
        const { data: updateCustomer, error: errorUpdate } = await db
          .from('customer')
          .update({ email: emailChanged, name: nameChanged })
          .eq('email', email)
          .select();
        if (errorUpdate) {
          console.error(errorUpdate);
          return;
        }

        const { data: inforChanged, error: errorChange } = await db
          .from('customer')
          .select('*')
          .eq('email', emailChanged)
          .eq('name', nameChanged);
        if (errorChange) {
          console.error(errorChange);
          return;
        }
        if (inforChanged && inforChanged.length > 0) {
          res.json({
            changed: true,
            status: 'Success',
            email: inforChanged[0].email,
            name: inforChanged[0].name
          });
        } else {
          res.json({ changed: false, status: 'Change Failed' });
        }
      } else {
        res.json({ changed: false, status: 'Info not Exist' });
      }
    } else if (findUser.length > 0) {
      res.json({ changed: false, status: 'Email Exist' });
    }
  } else {
    const { data, error: errorUpdate } = await db
      .from('customer')
      .update({ name: nameChanged })
      .eq('email', email)
      .select();
    if (errorUpdate) {
      console.error(errorUpdate);
      return;
    }
    if (data) {
      res.json({ changed: true, status: 'Success', email: email, name: nameChanged });
    }
  }
});

router.post('/deleteUser', async (req, res) => {
  const { email } = req.body;
  const { error } = await db.from('customer').delete().eq('email', email);
  if (error) {
    console.error(error);
    return;
  }
  res.json({ deleted: true, status: 'delete' });
});

router.post('/tableYards', async (req, res) => {
  // const table = await db.query(
  //   `Select yard_id, badminton_yard.name, address, phone_num, owner_name
  //   From badminton_yard
  //   Join yard_owner
  //   On badminton_yard.owner_id = yard_owner.owner_id
  //   ORDER BY yard_id ASC
  //   `
  // )
  const { data: table, error: errorTable } = await db
    .from('badminton_yard')
    .select('yard_id, name, address, phone_num, yard_owner (owner_id, owner_name)')
    .order('yard_id', { ascending: true });
  if (errorTable) {
    console.error(errorTable);
    return;
  }
  if (table && table.length > 0) {
    res.json({ table: table });
  }
});

router.post('/changeYards', async (req, res) => {
  const { id, name, address, phone } = req.body;
  const { data: dataChange, error: errorChange } = await db
    .from('badminton_yard')
    .select('*')
    .eq('yard_id', id);
  if (errorChange) {
    console.error(errorChange);
    return;
  }
  if (dataChange && dataChange.length > 0) {
    const { data: dataUpdate, error: errorUpdate } = await db
      .from('badminton_yard')
      .update({ name: name, address: address, phone_num: phone })
      .eq('yard_id', id)
      .select();
    if (errorUpdate) {
      console.error(errorUpdate);
      return;
    }
    if (dataUpdate && dataUpdate.length > 0) {
      res.json({
        changed: true,
        status: 'Success',
        name: dataUpdate[0].name,
        address: dataUpdate[0].address,
        phone_num: dataUpdate[0].phone_num
      });
    } else {
      res.json({ changed: false, status: 'Changed' });
    }
  } else {
    res.json({ changed: false, status: 'Yards not exist' });
  }
});

router.post('/deleteYards', async (req, res) => {
  const { id } = req.body;
  const { error } = await db.from('badminton_yard').delete().eq('yard_id', id);
  if (error) {
    console.error(error);
    return;
  }
  res.json({ deleted: true, status: 'delete' });
});

router.post('/tablePayments', async (req, res) => {
  // const table = await db.query(
  //   `Select name, owner_name, total_cost from (payment
  //   Join customer On payment.customer_id = customer.customer_id)
  //   Join yard_owner On payment.owner_id = yard_owner.owner_id
  //   Order By payment_id ASC
  //   `
  // )
  const { data: table, error: errorTable } = await db.from('payment').select(
    `total_cost,
      customer:customer_id (name)
      `
  );
  if (errorTable) {
    console.error(errorTable);
    return;
  }
  if (table && table.length > 0) {
    // console.log(table);
    res.json({ table: table });
  }
});
module.exports = router;
