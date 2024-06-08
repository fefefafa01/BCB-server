const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.post('/info', async (req, res) => {
  // console.log(req.body);
  const { email, curEmail, curName, name } = req.body;
  if (email != curEmail) {
    // const checkChangeInfo = await db.query(
    //     "Select * From admin where email = $1",
    //     [req.body.email]
    // );
    const { data: checkChangeInfo, error: ErrorInfo } = await db
      .from('admin')
      .select('*')
      .eq('email', email);

    if (ErrorInfo) {
      console.error(ErrorInfo);
      return;
    }
    if (checkChangeInfo.length == 0) {
      // const checkExistance = await db.query(
      //     "Select * From admin Where email = $1 And name = $2",
      //     [req.body.curEmail, req.body.curName]
      // )
      const { data: checkExistance, error: errorExistance } = await db
        .from('admin')
        .select('*')
        .eq('email', curEmail)
        .eq('name', curName);

      if (errorExistance) {
        console.error(errorExistance);
        return;
      }
      if (checkExistance.length > 0) {
        // await db.query(
        //     "Update admin Set email = $1, name = $2 Where email = $3 and name = $4",
        //     [req.body.email, req.body.name, req.body.curEmail, req.body.curName]
        // );
        const { data: updateAdmin, error: errorUpdate } = await db
          .from('admin')
          .update({ email: email, name: name })
          .eq('email', curEmail)
          .eq('name', curName)
          .select();

        if (errorUpdate) {
          console.error(errorUpdate);
          return;
        }

        // const infoChanged = await db.query(
        //     "Select * from admin where email = $1, name = $2",
        //     [req.body.email, req.body.name]
        // )
        const { data: infoChanged, error: errorChange } = await db
          .from('admin')
          .select('*')
          .eq('email', email)
          .eq('name', name);

        if (errorChange) {
          console.error(errorChange);
          return;
        }
        if (infoChanged && infoChanged.length > 0) {
          res.json({
            changed: true,
            status: 'Success',
            email: infoChanged[0].email,
            name: infoChanged[0].name
          });
        } else {
          res.json({ changed: false, status: 'Change Failed' });
        }
      } else {
        res.json({ changed: false, status: 'Info not Exist' });
      }
    } else if (checkChangeInfo.length > 0) {
      res.json({ changed: false, status: 'Email Exist' });
    }
  } else {
    // await db.query(
    //     "Update admin Set name = $1 Where email = $2 and name = $3",
    //     [req.body.name, req.body.curEmail, req.body.curName]
    // )
    const { data, error: errorUpdate } = await db
      .from('admin')
      .update({ name: name })
      .eq('email', curEmail)
      .eq('name', curName)
      .select();

    if (errorUpdate) {
      console.error(errorUpdate);
      return;
    }

    if (data) {
      res.json({ changed: true, status: 'Success', email: email, name: name });
    }
  }
});

router.post('/password', async (req, res) => {
  const { email, curPass, password } = req.body;
  // console.log(req.body);
  // var checkPassword = await db.query(
  //   `Select * From admin Where email = $1 and password = $2`,
  //   [req.body.email, req.body.curPass]
  // )
  const { data: checkPassword, error: errorPassword } = await db
    .from('admin')
    .select('*')
    .eq('email', email)
    .eq('password', curPass);

  if (errorPassword) {
    console.error(errorPassword);
    return;
  }
  if (checkPassword.length > 0) {
    //   await db.query(
    //     "Update admin Set password = $1 Where email = $2 ",
    //     [req.body.password, req.body.email]
    //   );
    const { data, error } = await db
      .from('admin')
      .update({ password: password })
      .eq('email', email);

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      res.json({ changed: true, status: 'Success' });
    }
  } else {
    res.json({ changed: false, status: 'Info Not Exist' });
  }
});

module.exports = router;
