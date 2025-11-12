import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";

const Survey = () => {
  const navigate = useNavigate();
  let questionsSchema = object({
    comment: string().required("لطفا نظر خود را بنویسید"),
    q1: string().required("لطفا پاسخ دهید"),
    q2: string().required("لطفا پاسخ دهید"),
    q3: string().required("لطفا پاسخ دهید"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(questionsSchema),
  });

  const onSubmit = async (data) => {
    await fetch("http://localhost:4000/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    alert("✅ نظر شما ثبت شد");
    // بعد از ثبت نظر، لاگ اوت
    localStorage.removeItem("isAuthenticated");

    // هدایت به صفحه لاگین
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
        dir="rtl" // اینجا جهت نوشتار رو راست به چپ می‌کنیم
      >
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          📊 نظرسنجی پزشک
        </h2>
        
        {/* نظر آزاد */}
        <label className="block text-gray-700 font-medium mb-2">
          نظر کلی شما
        </label>
        <textarea
          {...register("comment")}
          placeholder="نظر خود را بنویسید..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-right"
        />
        {errors.comment && (
          <span className="text-red-500 text-sm">{errors.comment.message}</span>
        )}

        {/* سوال ۱ */}
        <label className="block text-gray-700 font-medium mt-4 mb-2">
          سؤال ۱: رفتار پزشک چگونه بود؟
        </label>
        <input
          {...register("q1")}
          type="text"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-right"
        />
        {errors.q1 && (
          <span className="text-red-500 text-sm">{errors.q1.message}</span>
        )}

        {/* سوال ۲ */}
        <label className="block text-gray-700 font-medium mt-4 mb-2">
          سؤال ۲: زمان انتظار چقدر بود؟
        </label>
        <input
          {...register("q2")}
          type="text"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-right"
        />
        {errors.q2 && (
          <span className="text-red-500 text-sm">{errors.q2.message}</span>
        )}

        {/* سوال ۳ */}
        <label className="block text-gray-700 font-medium mt-4 mb-2">
          سؤال ۳: آیا پزشک توضیحات کافی داد؟
        </label>
        <input
          {...register("q3")}
          type="text"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-right"
        />
        {errors.q3 && (
          <span className="text-red-500 text-sm">{errors.q3.message}</span>
        )}

        {/* دکمه ارسال */}
        <button
          type="submit"
          className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
        >
          ارسال نظر
        </button>
      </form>
    </div>
  );
};

export default Survey;
