import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Target,
  TrendingUp,
  Zap,
  ChevronDown,
  Activity,
  Database,
  Globe,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { useUI } from "../context/UIContext";


const AIReactor = () => {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center perspective-[1000px]">
      <div className="absolute w-32 h-32 bg-primary-500 rounded-full blur-[80px] animate-pulse opacity-60"></div>
      <div className="relative w-40 h-40 bg-gradient-to-b from-gray-900 to-black rounded-full border border-primary-500/50 flex items-center justify-center z-20 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
        <Cpu className="w-16 h-16 text-primary-400 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/20 to-transparent w-full h-full animate-[spin_3s_linear_infinite] opacity-50"></div>
      </div>
      <div className="absolute w-[300px] h-[300px] border-[1px] border-primary-500/30 rounded-full animate-[spin_10s_linear_infinite]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>
      </div>
      <div
        className="absolute w-[380px] h-[380px] border-[1px] border-blue-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"
        style={{ transform: "rotateX(60deg)" }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa]"></div>
      </div>
      <div className="absolute w-[450px] h-[450px] border-[2px] border-dashed border-purple-500/20 rounded-full animate-[spin_20s_linear_infinite]"></div>

      {}
      <div className="absolute top-20 right-10 p-3 glass-tech rounded-lg animate-float flex items-center gap-3 border-l-2 border-primary-500">
        <Activity className="w-5 h-5 text-primary-400" />
        <div>
          <div className="text-[10px] text-primary-300 font-display uppercase tracking-widest">
            Health Status
          </div>
          <div className="text-xs font-bold text-white">ANALYZING</div>
        </div>
      </div>

      {}
      <div
        className="absolute bottom-20 left-10 p-3 glass-tech rounded-lg animate-float flex items-center gap-3 border-r-2 border-blue-500"
        style={{ animationDelay: "2s" }}
      >
        <Database className="w-5 h-5 text-blue-400" />
        <div>
          <div className="text-[10px] text-blue-300 font-display uppercase tracking-widest">
            Personal Data
          </div>
          <div className="text-xs font-bold text-white">SECURE</div>
        </div>
      </div>
    </div>
  );
};


const DigitalGridBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gray-50 dark:bg-dark-bg transition-colors duration-500">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white dark:from-dark-bg dark:via-transparent dark:to-dark-bg"></div>
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
  </div>
);


interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: string;
  direction?: "up" | "left" | "right";
}
const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = "0s",
  direction = "up",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
  const getTransform = () => {
    if (direction === "left") return "-translate-x-20 opacity-0";
    if (direction === "right") return "translate-x-20 opacity-0";
    return "translate-y-20 opacity-0 scale-95";
  };
  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay }}
      className={`transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) transform ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0 scale-100"
          : getTransform()
      }`}
    >
      {children}
    </div>
  );
};

const LandingPage: React.FC = () => {
  const { t } = useUI();

  const goals = [
    {
      id: "weight-loss",
      title: t("goal.loss"),
      description: t("goal.loss.desc"),
      icon: TrendingUp,
      color: "text-neon-blue",
      border: "hover:border-neon-blue",
      gradient: "from-neon-blue/20 to-transparent",
      features: ["Smart Calorie Deficit", "Fat Burning", "Progress Tracking"],
    },
    {
      id: "weight-gain",
      title: t("goal.gain"),
      description: t("goal.gain.desc"),
      icon: Target,
      color: "text-neon-green",
      border: "hover:border-neon-green",
      gradient: "from-neon-green/20 to-transparent",
      features: ["Meal Planning", "Healthy Mass", "Strength Gains"],
    },
    {
      id: "muscle-gain",
      title: t("goal.muscle"),
      description: t("goal.muscle.desc"),
      icon: Zap,
      color: "text-neon-purple",
      border: "hover:border-neon-purple",
      gradient: "from-neon-purple/20 to-transparent",
      features: ["Protein Focus", "Workout Logs", "Recovery Stats"],
    },
  ];

  const fullTitle = t("hero.title");
  const lastSpaceIndex = fullTitle.lastIndexOf(" ");
  const titleMain =
    lastSpaceIndex !== -1 ? fullTitle.substring(0, lastSpaceIndex) : fullTitle;
  const titleGlow =
    lastSpaceIndex !== -1 ? fullTitle.substring(lastSpaceIndex + 1) : "";

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-transparent text-gray-800 dark:text-gray-100 no-scrollbar relative font-sans">
      <style>{`
        
        .glass-tech {
          background: rgba(15, 23, 42, 0.85); 
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .text-glow {
          text-shadow: 0 0 25px rgba(34, 197, 94, 0.6);
        }
      `}</style>

      <DigitalGridBackground />

      {}
      <section className="snap-start min-h-screen w-full flex items-center justify-center relative p-6 lg:p-12 z-10 overflow-hidden">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <ScrollReveal delay="0.1s" direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary-500/10 border border-primary-500/30 mb-8">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-display font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                  {t("hero.tagline")}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay="0.2s" direction="left">
              {}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-[0.9] tracking-tighter text-gray-900 dark:text-white uppercase">
                {titleMain}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-500 text-glow">
                  {titleGlow}
                </span>
                <span className="text-2xl md:text-4xl text-gray-500 dark:text-gray-400 stroke-text mt-4 block tracking-widest normal-case font-sans">
                  {t("hero.subtitle")}
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay="0.4s" direction="left">
              {}
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 mb-10 max-w-xl lg:mx-0 leading-relaxed font-light border-l-4 border-primary-500 pl-6">
                {t("hero.desc")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay="0.6s" direction="left">
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-5">
                <Link
                  to="/welcome"
                  className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-display font-bold uppercase tracking-wider overflow-hidden hover:scale-105 transition-transform duration-300 w-full sm:w-auto text-center clip-path-polygon"
                  style={{
                    clipPath:
                      "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)",
                  }}
                >
                  <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 mix-blend-exclusion"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {t("btn.start")} <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>

                <button
                  className="px-8 py-4 border-2 border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 font-display font-bold uppercase tracking-wider hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-300 w-full sm:w-auto"
                  style={{
                    clipPath:
                      "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)",
                  }}
                >
                  {t("btn.demo")}
                </button>
              </div>
            </ScrollReveal>
          </div>

          {}
          <div className="order-1 lg:order-2 flex justify-center relative">
            <ScrollReveal delay="0.4s" direction="right">
              <AIReactor />
            </ScrollReveal>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="text-[10px] font-display uppercase tracking-widest text-gray-500">
            Scroll to Explore
          </span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </section>

      {}
      <section className="snap-start min-h-screen w-full flex items-center justify-center p-6 z-10 bg-white/50 dark:bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl w-full mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              {}
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-tight">
                {t("goals.title")}
              </h2>
              <div className="h-1 w-24 bg-primary-500 mx-auto rounded-full mb-4"></div>
              {}
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                {t("goals.desc")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <ScrollReveal
                key={goal.id}
                delay={`${index * 0.15}s`}
                direction="up"
              >
                {}
                <Link
                  to="/welcome"
                  state={{ selectedGoal: goal.id }}
                  className={`group relative h-full flex flex-col p-8 glass-tech transition-all duration-300 hover:-translate-y-2 border border-white/5 border-t-white/20 ${goal.border} overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${goal.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10 w-14 h-14 bg-gray-900/50 rounded-lg border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <goal.icon className={`h-7 w-7 ${goal.color}`} />
                  </div>

                  <h3 className="relative z-10 text-2xl font-display font-bold mb-2 text-white uppercase tracking-wide">
                    {goal.title}
                  </h3>

                  <p className="relative z-10 text-sm text-gray-300 mb-8 leading-relaxed flex-grow font-sans">
                    {goal.description}
                  </p>

                  <div className="relative z-10 space-y-3 border-t border-gray-700/50 pt-6">
                    {goal.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center text-xs font-bold font-display text-gray-400 uppercase tracking-wider"
                      >
                        <div
                          className={`w-1 h-1 ${goal.color.replace(
                            "text",
                            "bg"
                          )} mr-2`}
                        ></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="absolute top-0 right-0 p-2">
                    <div className="w-2 h-2 border-t border-r border-gray-500"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-2">
                    <div className="w-2 h-2 border-b border-l border-gray-500"></div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="snap-start min-h-screen w-full flex items-center justify-center p-6 z-10">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <ScrollReveal direction="right">
              {}
              <div className="relative glass-tech p-8 rounded-2xl border border-white/10">
                <div className="absolute -top-5 -left-5 w-20 h-20 border-t-4 border-l-4 border-primary-500 rounded-tl-3xl opacity-50"></div>

                <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className="text-xs font-display text-gray-400 uppercase mb-1">
                      Health Score
                    </div>
                    <div className="text-4xl font-display font-bold text-white">
                      98.2<span className="text-primary-500">%</span>
                    </div>
                  </div>
                  <Globe className="w-10 h-10 text-gray-600 animate-spin-slow" />
                </div>

                <div className="flex items-end justify-between h-48 gap-2">
                  {[40, 60, 45, 80, 55, 90, 70, 95].map((h, i) => (
                    <div
                      key={i}
                      className="w-full bg-gray-800 rounded-t-sm relative group overflow-hidden"
                    >
                      <div
                        style={{ height: `${h}%` }}
                        className={`absolute bottom-0 w-full bg-gradient-to-t from-primary-900 to-primary-500 transition-all duration-1000 delay-${
                          i * 100
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="order-1 lg:order-2 pl-0 lg:pl-10">
            <ScrollReveal direction="left">
              {}
              <h2 className="text-4xl md:text-6xl font-display font-black text-gray-900 dark:text-white mb-8 uppercase leading-none">
                {t("why.title")}
              </h2>
              <div className="space-y-8">
                {}
                <p className="text-gray-700 dark:text-gray-400 text-lg mb-8">
                  {t("why.desc")}
                </p>
                {[
                  {
                    label: "Active Users",
                    val: "10k+",
                    desc: "Trusting our AI algorithms",
                  },
                  {
                    label: "Success Rate",
                    val: "94%",
                    desc: "Achieving primary health goals",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-gray-300 dark:border-gray-700 pl-6 hover:border-primary-500 transition-colors"
                  >
                    {}
                    <div className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">
                      {stat.val}
                    </div>
                    <div className="text-xs font-bold text-primary-600 dark:text-primary-500 uppercase tracking-widest mb-2">
                      {stat.label}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {stat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {}
      <section className="snap-start min-h-screen w-full flex items-center justify-center p-6 z-10">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-500/10 rounded-full blur-[100px]"></div>

            {}
            <h2 className="relative text-5xl md:text-8xl font-display font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tighter leading-none">
              {t("cta.title")}
            </h2>

            {}
            <p className="relative text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-light">
              {t("cta.desc")}
            </p>

            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-blue-500 rounded-sm blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Link
                to="/welcome"
                className="relative flex items-center px-12 py-6 bg-black leading-none rounded-sm border border-gray-800"
              >
                <span className="font-display font-bold text-white uppercase tracking-widest mr-4">
                  {t("btn.free")}
                </span>
                <ArrowRight className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 opacity-70 dark:opacity-50 max-w-lg mx-auto">
              {[
                { icon: ShieldCheck, label: "Secure" },
                { icon: Zap, label: "Fast" },
                { icon: Activity, label: "Precise" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <item.icon className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-[10px] uppercase tracking-widest text-gray-500">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default LandingPage;
