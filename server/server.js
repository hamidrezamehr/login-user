// server.js
import express from "express";
import session from "express-session";
import cors from "cors";

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
  const small = Math.floor(Math.random() * 9) + 1;
  const large = Math.floor(Math.random() * 81) + 10;
  const question = `${small} + ${large} = ?`;
  const answer = (small + large).toString();

  req.session.captcha = answer;

  const colors = ["red", "blue", "green", "purple", "orange"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="50">
      <rect width="100%" height="100%" fill="#f9f9f9"/>
      <line x1="0" y1="${Math.random()*50}" x2="150" y2="${Math.random()*50}" stroke="gray" stroke-width="1"/>
      <circle cx="${Math.random()*150}" cy="${Math.random()*50}" r="3" fill="lightgray"/>
      <text x="10" y="35" font-size="24" fill="${color}" transform="rotate(${Math.random()*10 - 5}, 75, 25)">
        ${question}
      </text>
    </svg>
  `;

  res.type('svg');
  res.send(svg);
});



app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "خطا در خروج" });
    }
    res.clearCookie("connect.sid"); // پاک کردن کوکی سشن
    res.json({ success: true, message: "خروج موفق" });
  });
});


app.listen(4000, () => console.log("✅ Server running on port 4000"));
