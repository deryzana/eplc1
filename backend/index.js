import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Pool } = pkg;
import studentRouter from './student.js';

const app = express();
const port = 5137;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres', // ganti jika user berbeda
  host: 'localhost',
  database: 'englishcourse',
  password: 'buklashkl25!', // ganti jika password berbeda
  port: 5432,
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT userid, email, password, failedattempt FROM englishcourse.auth_useraccess WHERE userid = $1 OR email = $1`,
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Username is not registered' });
    }
    const user = result.rows[0];
    if (user.failedattempt >= 4) {
      return res.status(401).json({
        message: 'You have reached max login attempt! Reset Password first!',
      });
    }
    if (user.password !== password && user.failedattempt === 2) {
      await pool.query(
        `UPDATE englishcourse.auth_useraccess SET failedattempt = failedattempt + 1 WHERE userid = $1`,
        [user.userid]
      );
      return res.status(401).json({ message: 'You have 1 last chance to login before resetting the password.' });
    }
    if (user.password !== password && user.failedattempt === 3) {
      await pool.query(
        `UPDATE englishcourse.auth_useraccess SET failedattempt = failedattempt + 1 WHERE userid = $1`,
        [user.userid]
      );
      return res.status(401).json({ message: 'Password is still incorrect. Reset Password!' });
    }        
    if (user.password !== password) {
      await pool.query(
        `UPDATE englishcourse.auth_useraccess SET failedattempt = failedattempt + 1 WHERE userid = $1`,
        [user.userid]
      );
      return res.status(401).json({ message: 'Password is incorrect.' });
    }
    // Jika login berhasil, reset failed attempt
    await pool.query(
      `UPDATE englishcourse.auth_useraccess SET failedattempt = 0, lastlogin = now() WHERE userid = $1`,
      [user.userid]
    );
  
    return res.json({ message: 'Login Successfull' });
  } 
  catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.use('/api/student', studentRouter);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
