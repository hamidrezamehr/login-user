import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const Login = () => {
  const [captchaSvg, setCaptchaSvg] = useState(null);

  const fetchCaptcha = () => {
    fetch("http://localhost:4000/captcha", {
      credentials: "include",
    })
      .then((res) => res.text())
      .then((data) => setCaptchaSvg(data));
  };


  useEffect(() => {
    fetch("http://localhost:4000/captcha", {
      credentials: "include",
    })
      .then((res) => res.text())
      .then((data) => setCaptchaSvg(data));
  }, []);
  let userSchema = object({
    nationalCode: string()
      .required("کد ملی الزامی است")
      .matches(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد")
      .test("isValidNationalCode", "کد ملی معتبر نیست", (value) => {
        if (!value) return false;
        const check = +value[9];
        const sum = [...value]
          .slice(0, 9)
          .reduce((acc, digit, i) => acc + +digit * (10 - i), 0);
        const remainder = sum % 11;
        return (
          (remainder < 2 && check === remainder) ||
          (remainder >= 2 && check === 11 - remainder)
        );
      }),
    captcha: string()
      .required("کپچا الزامی است")
      .matches(/^\d+$/, "کپچا باید فقط عدد باشد"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:4000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ ورود موفق");
      } else {
        alert("❌ کپچا یا کد ملی نامعتبر است");
      }
    } catch (err) {
      console.error("خطا در ارسال:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-100 from-blue-100 to-purple-200 flex items-center justify-center overflow-hidden">
      <div className="hidden lg:block absolute inset-0 z-0">
        <img
          src="/logo.png"
          alt="Background"
          className="w-full h-full object-cover blur-xl opacity-30"
        />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center"
        >
          <h2 className="text-xl font-bold mb-4 text-center">ورود با کد ملی</h2>
          <input
            {...register("nationalCode", { required: true })}
            type="text"
            placeholder="کد ملی"
            className="w-full mb-3 px-4 py-2 border rounded"
          />
          {errors.nationalCode && (
            <span className="text-red-500">{errors.nationalCode.message}</span>
          )}
          <div className="mb-3" />
          <div className="mb-3 w-full">
            <div dangerouslySetInnerHTML={{ __html: captchaSvg }} />
            <button
              type="button"
              onClick={fetchCaptcha}
              className="text-sm text-blue-600 underline mb-2"
            >
              بارگیری مجدد کپچا
            </button>
            <input
              {...register("captcha", { required: "کپچا الزامی است" })}
              type="text"
              placeholder="کد کپچا را وارد کنید"
              className="w-full mt-2 px-4 py-2 border rounded"
            />
            {errors.captcha && (
              <span className="text-red-500">{errors.captcha.message}</span>
            )}
          </div>

          {/* <div className="mb-3 w-full">
            <div dangerouslySetInnerHTML={{ __html: captchaSvg }} />
            <input
              {...register("captcha", { required: "کپچا الزامی است" })}
              type="text"
              placeholder="کد کپچا را وارد کنید"
              className="w-full mt-2 px-4 py-2 border rounded"
            />
            {errors.captcha && (
              <span className="text-red-500">{errors.captcha.message}</span>
            )}
          </div> */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
