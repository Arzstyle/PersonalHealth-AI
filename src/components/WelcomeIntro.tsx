import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";

const WelcomeIntro: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const slides = [
    {
      title: "Welcome to PersonalHealth AI",
      description:
        "Your comprehensive companion for a healthier, stronger, and more balanced life.",
      image: "/img/welcome_1.png",
      color: "from-blue-50 to-green-50",
    },
    {
      title: "AI-Powered Planning",
      description:
        "Let our advanced AI crate personalized meal and workout plans just for you.",
      image: "/img/welcome_2.png",
      color: "from-green-50 to-indigo-50",
    },
    {
      title: "Track & Improve",
      description:
        "Monitor your progress with deep insights and real-time analytics.",
      image: "/img/welcome_3.png",
      color: "from-indigo-50 to-purple-50",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((curr) => curr + 1);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-gray-50">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${slides[currentSlide].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
      </div>
      {/* Main Content */}
      <div
        className={`relative z-10 max-w-md w-full flex flex-col items-center transition-all duration-500 transform ${
          showPopup ? "blur-sm scale-95 opacity-50" : "scale-100 opacity-100"
        }`}
      >
        {/* Spacer to push content down since image is now bg */}
        <div className="w-full h-48 sm:h-64"></div>

        {/* Text Content */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-green-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full bg-gray-900 text-white py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <span>
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </span>
          <ChevronRight
            className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
              currentSlide === slides.length - 1 ? "hidden" : "block"
            }`}
          />
          {currentSlide === slides.length - 1 && (
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          )}
        </button>
      </div>

      {/* Login Requirement Popup with Modern Glassmorphism */}
      {showPopup && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-sm p-8 transform transition-all animate-slide-up border border-white/50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full blur-2xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-50"></div>

            <div className="relative z-10 text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-blue-50 mb-6 shadow-inner">
                <ShieldCheck className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Secure Account Access
              </h2>

              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                To create your personalized AI plan and safeguard your progress,
                please log in or create an account. It's quick and secure!
              </p>

              <button
                onClick={() => navigate("/onboarding")}
                className="w-full flex items-center justify-center px-6 py-4 text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Go to Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-800 font-medium"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-pulse-slow {
           animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomeIntro;
