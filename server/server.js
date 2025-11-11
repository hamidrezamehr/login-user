// server.js
import express from "express";
import session from "express-session";
import cors from "cors";
import svgCaptcha from "svg-captcha";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

app.post("/verify", (req, res) => {
  const { nationalCode, captcha } = req.body;
  const isCaptchaValid = captcha === req.session.captcha;
  const isNationalCodeValid = /^[0-9]{10}$/.test(nationalCode); // اعتبارسنجی ساده

  if (isCaptchaValid && isNationalCodeValid) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
app.get('/captcha', (req, res) => {
  const small = Math.floor(Math.random() * 9) + 1;     // عدد اول: 1 تا 9
  const large = Math.floor(Math.random() * 81) + 10;   // عدد دوم: 10 تا 90
  const question = `${small} + ${large} = ?`;
  const answer = (small + large).toString();

  // تولید SVG خام با متن تصادفی
  const captcha = svgCaptcha.create({
    noise: 0,
    color: true,
    background: '#ffffff',
    width: 150,
    height: 50,
  });

  // جایگزینی کامل متن داخل SVG با عبارت ریاضی دلخواه
  captcha.data = captcha.data.replace(
    /<text[^>]*>(.*?)<\/text>/,
    `<text x="10" y="35" font-size="24" fill="black">${question}</text>`
  );

  req.session.captcha = answer;
  res.type('svg');
  res.send(captcha.data);
});


app.post('/verify', (req, res) => {
  const { nationalCode, captcha } = req.body;
  const isCaptchaValid = captcha === req.session.captcha;
  const isNationalCodeValid = isValidIranianNationalCode(nationalCode);

  if (isCaptchaValid && isNationalCodeValid) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "کپچا یا کد ملی نامعتبر است" });
  }
});


app.listen(4000, () => console.log("✅ Server running on port 4000"));
