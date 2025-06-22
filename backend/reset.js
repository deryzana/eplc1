import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import nodemailer from 'nodemailer';

const { Pool } = pkg;
const app = express();
const port = 3003;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'englishcourse',
  password: 'buklashkl25!',
  port: 5432,
});

// Konfigurasi transporter nodemailer (contoh Gmail, ganti sesuai kebutuhan)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ryzwanmukti@gmail.com', // GANTI dengan email pengirim
    pass: 'fuwwyskecnrrtuku' // GANTI dengan app password Gmail
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query(
      `SELECT userid, email FROM englishcourse.auth_useraccess WHERE userid = $1 OR email = $1`,
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Username/email tidak ditemukan.' });
    }
    const user = result.rows[0];
    // Generate token reset sederhana (sebaiknya gunakan JWT/UUID di produksi)
    const token = Math.random().toString(36).substr(2);
    // Simpan token ke database (bisa di kolom baru, atau buat tabel reset_token)
    await pool.query(
      `UPDATE englishcourse.auth_useraccess SET reset_token = $1 WHERE userid = $2 OR email = $2`,
      [token, username]
    );
    // Kirim email reset
    const resetLink = `http://localhost:5173/reset-password?token=${token}&user=${encodeURIComponent(user.userid)}`;
    await transporter.sendMail({
      from: 'ryzwanmukti@gmail.com',
      to: user.email,
      subject: 'Reset Password EPLC',
      html: `<p>Klik link berikut untuk reset password Anda:<br><a href="${resetLink}">${resetLink}</a></p>`
    });
    return res.json({ message: 'Check your email to reset the password.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to sent email Reset Password.', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
