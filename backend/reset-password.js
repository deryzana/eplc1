import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();
const port = 3004;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'englishcourse',
  password: 'buklashkl25!',
  port: 5432,
});

app.post('/api/reset-password', async (req, res) => {
  const { user, token, password } = req.body;
  try {
    // Debug log
    console.log('Reset request:', { user, token, password });
    // Validasi token
    const result = await pool.query(
      `SELECT reset_token FROM englishcourse.auth_useraccess WHERE userid = $1`,
      [user]
    );
    console.log('Token in DB:', result.rows);
    if (result.rows.length === 0 || result.rows[0].reset_token !== token) {
      console.log('Token mismatch or not found');
      return res.status(400).json({ message: 'Reset Token is expired or has been used.' });
    }
    // Update password dan hapus token, !!reset failed attempts(hanya developer yang bisa reset failed attempt demi keamanan!!)
    const updateResult = await pool.query(
      `UPDATE englishcourse.auth_useraccess SET password = $1, reset_token = NULL, failedattempt = 0 WHERE userid = $2`,
      [password, user]
    );
    console.log('Update result:', updateResult);
    if (updateResult.rowCount === 0) {
      console.log('Update failed, user not found');
      return res.status(400).json({ message: 'User is not found while Reset Password.' });
    }
    return res.json({ message: 'Reset password is successful, you may login with your new Password.', showLoginBtn: true });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Failed to reset password.', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Reset password API running on port ${port}`);
});
