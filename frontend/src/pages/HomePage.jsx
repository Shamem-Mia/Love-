import React, { useState, useEffect } from "react";
import { Heart, User, Calendar, BookOpen, Key } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance.js";
import Confetti from "react-confetti";
// import useWindowSize from "../hooks/useWindowSize";

/**
 * Love Calculator Component
 *
 * A professional-grade love compatibility calculator with animations and detailed results
 */
const HomePage = () => {
  // Form state management
  const [formData, setFormData] = useState({
    yourName: "",
    yourAge: "",
    yourEducation: "",
    crushName: "",
    crushAge: "",
    crushEducation: "",
    relationshipMonths: "",
    relationshipDays: "",
    idPin: "",
  });

  // Result and loading states
  const [lovePercentage, setLovePercentage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  // Custom hook for window size tracking
  function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  }

  /**
   * Handle form input changes
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Validate the form data before calculation
   * @returns {boolean} True if validation passes, false otherwise
   */
  const validateForm = () => {
    if (!formData.yourName || !formData.crushName) {
      toast.error("Both names are required!");
      return false;
    }

    if (!/^\d{5}$/.test(formData.idPin)) {
      toast.error("ID Pin must be a 5-digit number");
      return false;
    }

    if (formData.yourAge && (formData.yourAge < 13 || formData.yourAge > 120)) {
      toast.error("Please enter a valid age between 13 and 120");
      return false;
    }

    if (
      formData.crushAge &&
      (formData.crushAge < 13 || formData.crushAge > 120)
    ) {
      toast.error("Please enter a valid age for your crush between 13 and 120");
      return false;
    }

    return true;
  };

  /**
   * Calculate love compatibility based on form inputs
   * @returns {number} The calculated love percentage
   */
  const calculateCompatibility = () => {
    let percentage = 50; // Base percentage

    // Name compatibility (10-30%)
    if (formData.yourName.toLowerCase() === formData.crushName.toLowerCase()) {
      percentage += 30;
    } else if (formData.yourName[0] === formData.crushName[0]) {
      percentage += 10;
    }

    // Age compatibility (5-20%)
    const ageDiff = Math.abs(
      parseInt(formData.yourAge) - parseInt(formData.crushAge)
    );
    if (ageDiff <= 2) percentage += 20;
    else if (ageDiff <= 5) percentage += 10;
    else if (ageDiff <= 10) percentage += 5;

    // Education compatibility (5-15%)
    const educationPairs = [
      ["engineer", "medical"],
      ["doctor", "engineer"],
      ["lawyer", "doctor"],
    ];

    const currentPair = [
      formData.yourEducation.toLowerCase(),
      formData.crushEducation.toLowerCase(),
    ];

    if (
      educationPairs.some(
        (pair) =>
          (pair[0] === currentPair[0] && pair[1] === currentPair[1]) ||
          (pair[0] === currentPair[1] && pair[1] === currentPair[0])
      )
    ) {
      percentage += 15;
    } else if (formData.yourEducation === formData.crushEducation) {
      percentage += 10;
    } else {
      percentage += 5;
    }

    // Relationship duration (10-40% - heavily weighted)
    const months = parseInt(formData.relationshipMonths) || 0;
    const days = parseInt(formData.relationshipDays) || 0;
    const totalMonths = months + days / 30;

    if (totalMonths > 24) percentage += 40;
    else if (totalMonths > 18) percentage += 30;
    else if (totalMonths > 12) percentage += 25;
    else if (totalMonths > 9) percentage += 20;
    else if (totalMonths > 6) percentage += 15;
    else if (totalMonths > 3) percentage += 10;
    else if (totalMonths > 1) percentage += 5;

    // Ensure percentage is between 1-100
    return Math.max(1, Math.min(100, Math.round(percentage)));
  };

  /**
   * Handle form submission and calculate love percentage
   * @param {React.FormEvent} e - The form submission event
   */
  const calculateLove = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowConfetti(false);

    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      const percentage = calculateCompatibility();

      // Save to backend
      await axiosInstance.post("/users/calculate", {
        ...formData,
        lovePercentage: percentage,
      });

      setLovePercentage(percentage);

      if (percentage >= 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      toast.success("Love compatibility calculated successfully!");
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to calculate love compatibility"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get love comment based on percentage
   * @param {number} percentage - The love percentage
   * @returns {Object} Contains main comment, sub comment, emoji and color
   */
  const getLoveComment = (percentage) => {
    const comments = {
      95: {
        main: "Soulmates! Your love is written in the stars ✨.Successful Love",
        sub: `You and ${formData.crushName} are destined to be together forever!`,
        emoji: "💑",
        color: "text-purple-600",
        advice:
          "This rare connection deserves your full commitment. Plan your future together!",
      },
      90: {
        main: "True love! Your relationship will be successful 💍",
        sub: `${formData.crushName} is your perfect match in every way!`,
        emoji: "💞",
        color: "text-red-500",
        advice:
          "Your bond is incredibly strong. Consider taking the next step in your relationship!",
      },
      85: {
        main: "Exceptional connection! This love will last ❤️‍🔥",
        sub: `You and ${formData.crushName} have something truly special!`,
        emoji: "🥰",
        color: "text-pink-600",
        advice:
          "Nurture this beautiful relationship with open communication and shared experiences.",
      },
      80: {
        main: "Perfect match! You two are meant to be together! ❤️",
        sub: `${formData.crushName} is clearly the one for you!`,
        emoji: "💕",
        color: "text-pink-500",
        advice:
          "Keep investing in this relationship - it has wonderful potential!",
      },
      70: {
        main: "Great compatibility! You have a strong connection 💘",
        sub: `With some effort, you and ${formData.crushName} could go far!`,
        emoji: "💓",
        color: "text-pink-400",
        advice:
          "Focus on understanding each other's needs to strengthen your bond.",
      },
      60: {
        main: "Good potential! This relationship could work well 💖",
        sub: `${formData.crushName} seems to be a good match for you!`,
        emoji: "💗",
        color: "text-pink-300",
        advice: "Spend quality time together to deepen your connection.",
      },
      40: {
        main: "Potential exists! Love needs nurturing 💝",
        sub: `You and ${formData.crushName} might need to work on your connection.`,
        emoji: "💟",
        color: "text-pink-200",
        advice: "Communication and compromise will be key to your success.",
      },
      default: {
        main: "Challenges ahead! But love can grow 💔",
        sub: `Don't lose hope! Relationships with ${formData.crushName} can improve with time.`,
        emoji: "💞",
        color: "text-gray-400",
        advice: "Focus on building trust and understanding between you.",
      },
    };

    if (percentage >= 95) return comments[95];
    if (percentage >= 90) return comments[90];
    if (percentage >= 85) return comments[85];
    if (percentage >= 80) return comments[80];
    if (percentage >= 70) return comments[70];
    if (percentage >= 60) return comments[60];
    if (percentage >= 40) return comments[40];
    return comments.default;
  };

  const loveComment =
    lovePercentage !== null ? getLoveComment(lovePercentage) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
            Love Compatibility Calculator
          </h1>
          <p className="text-lg text-pink-800">
            Discover the true potential of your relationship
          </p>
        </div>

        <form
          onSubmit={calculateLove}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-pink-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Your Information Column */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-pink-600 flex items-center">
                <User className="mr-2 h-6 w-6" /> Your Information
              </h2>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  name="yourName"
                  value={formData.yourName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                  maxLength={50}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Your Age
                </label>
                <input
                  type="number"
                  name="yourAge"
                  value={formData.yourAge}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  min="13"
                  max="120"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Your Education
                </label>
                <select
                  name="yourEducation"
                  value={formData.yourEducation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                >
                  <option value="">Select your education</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Medical">Medical</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Crush Information Column */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-pink-600 flex items-center">
                <Heart className="mr-2 h-6 w-6" /> Crush Information
              </h2>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Crush Name
                </label>
                <input
                  type="text"
                  name="crushName"
                  value={formData.crushName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                  maxLength={50}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Crush Age
                </label>
                <input
                  type="number"
                  name="crushAge"
                  value={formData.crushAge}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  min="13"
                  max="120"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Crush Education
                </label>
                <select
                  name="crushEducation"
                  value={formData.crushEducation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                >
                  <option value="">Select crush's education</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Medical">Medical</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Relationship Duration and ID Pin */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-pink-600 flex items-center mb-4">
                  <Calendar className="mr-2 h-6 w-6" /> Relationship Duration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Months
                    </label>
                    <input
                      type="number"
                      name="relationshipMonths"
                      value={formData.relationshipMonths}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                      min="0"
                      max="1200"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Days
                    </label>
                    <input
                      type="number"
                      name="relationshipDays"
                      value={formData.relationshipDays}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                      min="0"
                      max="31"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-pink-600 flex items-center mb-4">
                  <Key className="mr-2 h-6 w-6" /> Verification
                </h2>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Your 5-digit Pin
                  </label>
                  <input
                    type="password"
                    name="idPin"
                    value={formData.idPin}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                    placeholder="Enter your 5-digit pin"
                    pattern="\d{5}"
                    maxLength="5"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 5-digit pin you received with the link
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 flex items-center mx-auto ${
                isLoading ? "cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" /> Calculate Love Percentage
                </>
              )}
            </button>
          </div>
        </form>

        {/* Result Display */}
        {lovePercentage !== null && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-pink-100 animate-fade-in">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4">
              Your Result
            </h2>

            {lovePercentage >= 80 && (
              <div className="mb-6 animate-bounce">
                <span className="text-5xl">🎉</span>
                <h3 className="text-2xl font-bold text-pink-500 mt-2">
                  Congratulations!
                </h3>
              </div>
            )}

            <div className="relative w-full h-10 bg-gray-100 rounded-full mb-6 overflow-hidden shadow-inner">
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000 ease-out`}
                style={{ width: `${lovePercentage}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                {lovePercentage}% Love
              </div>
            </div>

            <div className="space-y-4">
              <p className={`text-2xl font-bold ${loveComment.color}`}>
                {loveComment.main}
              </p>
              <p className="text-lg text-gray-700">{loveComment.sub}</p>
              <div className="text-5xl animate-pulse">{loveComment.emoji}</div>

              <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                <h4 className="font-medium text-pink-700 text-lg">
                  Relationship
                </h4>
                <p className="text-pink-600 mt-2">{loveComment.advice}</p>
                {lovePercentage >= 80 && (
                  <p className="text-xs text-pink-400 mt-2">
                    Based on your {formData.relationshipMonths || 0} months and{" "}
                    {formData.relationshipDays || 0} days together
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
