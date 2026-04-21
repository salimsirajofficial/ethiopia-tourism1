import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import api from "../api/axios";
import Navbar from "../components/Navbar/Navbar";
import { Card, CardContent } from "../components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError, FieldSeparator } from "../components/ui/field";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const destinations = [
    {
      id: "axum",
      title: "Ancient Axum",
      image: "https://res.cloudinary.com/dywydpgjg/image/upload/v1776565259/Ancient-Axum_lhdgau.jpg",
      code: "AXM",
      flight: "ET-2024",
      gate: "A12",
      badge: "Priority",
      pass: "Boarding Pass"
    },
    {
      id: "harar",
      title: "Ancient Harar",
      image: "https://res.cloudinary.com/dywydpgjg/image/upload/v1776565259/Ancient_harar_qddrc2.jpg",
      code: "HRR",
      flight: "ETH-HRR-99",
      gate: "H05",
      badge: "Walled City",
      pass: "Spiritual Pass"
    },
    {
      id: "gondar",
      title: "Gondar Castles",
      image: "https://res.cloudinary.com/dywydpgjg/image/upload/v1776567613/image8_yw0x3d.jpg",
      code: "GDQ",
      flight: "ETH-GD-77",
      gate: "G09",
      badge: "Medieval",
      pass: "Royal Pass"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [destinations.length]);

  const dest = destinations[currentIndex];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      localStorage.setItem("token", data.token);
      // In micro-frontend split, dashboard runs separately.
      // For now we still navigate to the same path so an eventual shell can intercept.
      navigate("/dashboard", { state: { user: data.user } });
    } catch (error) {
      console.error("Login error:", error);
      if (!error?.response) {
        alert("Backend is not reachable. Please start the server on port 5000.");
      } else {
        alert(error.response?.data?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const { data } = await api.post("/auth/google", {
          access_token: tokenResponse.access_token,
        });
        localStorage.setItem("token", data.token);
        navigate("/dashboard", { state: { user: data.user } });
      } catch (error) {
        console.error("Google login error:", error);
        alert(error.response?.data?.message || "Google login failed");
      }
      setIsLoading(false);
    },
    onError: () => {
      console.error("Login Failed");
      alert("Google Login Failed");
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 relative overflow-x-hidden">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-10 relative z-10 mt-16 md:mt-0">
        <div className="w-full max-w-sm md:max-w-5xl">
          <Card className="overflow-hidden p-0 border-none shadow-2xl rounded-3xl bg-background">
            <CardContent className="grid p-0 md:grid-cols-[1.2fr_1fr]">
              <form className="p-8 md:p-12 flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col items-start gap-1">
                  <h1 className="text-3xl font-black tracking-tight text-foreground">{t("auth.login.title")}</h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    {t("auth.login.subtitle")}
                  </p>
                </div>

                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="identifier">{t("auth.login.email")}</FieldLabel>
                    <Input
                      id="identifier"
                      name="identifier"
                      autoComplete="username"
                      placeholder="name@example.com"
                      className="h-10 rounded-xl"
                      value={formData.identifier}
                      onChange={handleChange}
                      required
                    />
                    {errors.identifier && <FieldError>{errors.identifier}</FieldError>}
                  </Field>

                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">{t("auth.login.password")}</FieldLabel>
                      <Link
                        to="/forgot-password"
                        className="ml-auto text-xs font-medium text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                      >
                        {t("auth.login.forgot")}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="h-10 rounded-xl"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && <FieldError>{errors.password}</FieldError>}
                  </Field>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-10 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-black transition-all shadow-md mt-2"
                  >
                    {t("auth.login.submit")}
                  </Button>

                  <FieldSeparator className="py-2 text-[10px] uppercase tracking-widest font-bold opacity-50 text-center">
                    Or continue with
                  </FieldSeparator>

                  <Button
                    type="button"
                    onClick={() => googleLogin()}
                    isLoading={isLoading}
                    className="h-10 rounded-xl text-black font-bold bg-secondary hover:bg-secondary/90 transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </Button>

                  <p className="text-center text-xs text-muted-foreground font-medium mt-2 bg-center">
                    {t("auth.login.noAccount")}{" "}
                    <Link to="/signup" className="text-primary font-bold hover:underline">
                      {t("auth.login.signup")}
                    </Link>
                  </p>
                </FieldGroup>
              </form>

              <div className="relative hidden md:flex flex-col bg-neutral-900 text-white overflow-hidden p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                  >
                    <img
                      src={dest.image}
                      alt={dest.title}
                      className="h-full w-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
                  </motion.div>
                </AnimatePresence>

                {/* Ticket Content */}
                <div className="relative z-10 flex flex-col h-full w-full p-8 justify-between">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={dest.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80"
                        >
                          {dest.pass}
                        </motion.p>
                      </AnimatePresence>
                      <AnimatePresence mode="wait">
                        <motion.h2
                          key={dest.id}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="text-2xl font-black tracking-tight"
                        >
                          {dest.title}
                        </motion.h2>
                      </AnimatePresence>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={dest.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black tracking-widest uppercase"
                      >
                        {dest.badge}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Perforation Line & Cutouts */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center px-0">
                    <div className="w-5 h-10 bg-neutral-950 rounded-r-full -ml-[10px]" />
                    <div className="flex-grow border-t-2 border-dashed border-white/20 mx-1" />
                    <div className="w-5 h-10 bg-neutral-950 rounded-l-full -mr-[10px]" />
                  </div>

                  {/* Ticket Details */}
                  <div className="grid grid-cols-2 gap-y-6 pt-12">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Passenger</p>
                      <p className="text-sm font-bold">Ethio Explorer</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Flight</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={dest.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-bold"
                        >
                          {dest.flight}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Destination</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={dest.id}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="text-sm font-bold font-mono"
                        >
                          {dest.code} ({dest.id.toUpperCase()})
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Gate</p>
                      <AnimatePresence mode="wait">
                        <motion.p key={dest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold">
                          {dest.gate}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Footer / QR Code */}
                  <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Departure</p>
                      <p className="text-xs font-medium">May 24, 2024 • 09:30 AM</p>
                    </div>
                    <div className="w-12 h-12 bg-white p-1 rounded-lg">
                      <svg viewBox="0 0 100 100" fill="black">
                        <rect x="10" y="10" width="20" height="20" />
                        <rect x="40" y="10" width="20" height="20" />
                        <rect x="70" y="10" width="20" height="20" />
                        <rect x="10" y="40" width="20" height="20" />
                        <rect x="40" y="40" width="20" height="20" />
                        <rect x="70" y="40" width="20" height="20" />
                        <rect x="10" y="70" width="20" height="20" />
                        <rect x="40" y="70" width="20" height="20" />
                        <rect x="70" y="70" width="20" height="20" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
