// server/controllers/authController.js
import { poolPromise } from '../config/db.js';

export const loginUser = async (req, res) => {
  const { email } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM Users WHERE Email = @email');

    if (result.recordset.length > 0) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: 'کاربر یافت نشد' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطای سرور' });
  }
};
