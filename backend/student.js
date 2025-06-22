import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

// Ganti konfigurasi sesuai database Anda
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'englishcourse',
  password: 'buklashkl25!', // Ganti jika password berbeda
  port: 5432,
});

router.post('/add-temp-student', async (req, res) => {
  const { fullName, email, phoneNumber, gender, address, city, program, period, pretestScore, placeofBirth, dateOfBirth } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO englishcourse.temp_student (full_name, email, phone_number, gender, address, domicile, program, period, pretest_score, place_of_birth, date_of_birth) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [fullName, email, phoneNumber, gender, address, city, program, period, pretestScore, placeofBirth, dateOfBirth]
    );
    res.status(201).json({ success: true, student: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
