import React from "react";
import { HeartHandshake, Sparkles } from "lucide-react";

const tips = [
  "প্রতিদিন অন্তত একবার ভালোবাসার কথা বলুন। ❤️",
  "মন খুলে কথা বলুন, সম্পর্ক আরও গভীর হবে। 🗣️",
  "ছোট ছোট সারপ্রাইজ দিন, সম্পর্ককে নতুন করে জাগিয়ে তুলবে। 🎁",
  "আজাইরা জিনিস রাইখা লেখাপড়া কর।😁",
  "আপনার বন্ধুর ক্রাশের নাম জেনে নিন। একটা একাউন্ট খুলে আইডির লিংকটা দিন।সাথে আপনার  IdPin(একাউন্ট খুললে পাবেন) দিন।যখনই আপনার বন্ধু তার নাম আর ক্রাশের নাম লিখে পার্সেন্টেজ দেখবে তখনই আপনার ইনবক্সে আপনার বন্ধুর এসব তথ্য চলে আসবে।এভাবে আপনার ইনোসেন্ট বন্ধুর ক্রাশ খুজে বের করেন",
];

const LoveTipsPage = () => {
  return (
    <div className="min-h-screen bg-rose-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-rose-600 flex justify-center items-center gap-2">
            <HeartHandshake /> ভালোবাসার টিপস
          </h1>
          <p className="text-gray-600 mt-2">
            ভালোবাসা গভীর করতে কিছু সহজ কিন্তু শক্তিশালী পরামর্শ ❤️
          </p>
        </div>

        <ul className="space-y-4 text-lg text-gray-700">
          {tips.map((tip, index) => (
            <li
              key={index}
              className="bg-rose-100 border border-rose-200 rounded-lg p-4 hover:shadow transition"
            >
              <span className="text-rose-500 font-semibold mr-2">
                {index + 1}.
              </span>
              {tip}
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center text-rose-600 text-xl font-medium flex items-center justify-center gap-2">
          <Sparkles className="animate-bounce" />
          সম্পর্কের যত্ন নিন, ভালোবাসা আরও গভীর হবে! 💑
          <Sparkles className="animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default LoveTipsPage;
