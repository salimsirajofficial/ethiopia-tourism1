import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import api from "../api/axios";
import { Card, CardContent } from "../components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "../components/ui/field";
import { useTranslation } from "react-i18next";

import { validateName, validateUsername, validateEmail, validatePassword } from "../utils/validators";
import Navbar from "../components/Navbar/Navbar";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const destinations = [
    { id: "harar", title: "Ancient Harar", image: "/assets/images/ethiopia/Ancient harar.jpg", code: "HRR", flight: "ETH-HRR-99", gate: "H05", badge: "Walled City", pass: "Spiritual Pass" },
    { id: "axum", title: "Ancient Axum", image: "/assets/images/ethiopia/Ancient Axum.jpg", code: "AXM", flight: "ET-2024", gate: "A12", badge: "Priority", pass: "Boarding Pass" },
    { id: "gondar", title: "Gondar Castles", image: "/assets/images/ethiopia/image8.jpg", code: "GDQ", flight: "ETH-GD-77", gate: "G09", badge: "Medieval", pass: "Royal Pass" },
    { id: "lalibela", title: "Lalibela Churches", image: "/assets/images/ethiopia/image3.jpg", code: "LAL", flight: "ETH-LAL-44", gate: "L07", badge: "Heritage", pass: "Premium Pass" },
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

  const validate = () => {
    const newErrors = {};
    const nameErr = validateName(formData.name);
    const userErr = validateUsername(formData.username);
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    if (nameErr) newErrors.name = nameErr;
    if (userErr) newErrors.username = userErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user?.fullName || formData.name);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.message || "Signup failed");
    }
    setIsLoading(false);
  };

  const handleGoogleClick = () => {
    const newErrors = {};
    const userErr = validateUsername(formData.username);
    if (userErr) {
      setErrors({ username: userErr });
      alert("Please enter a Username to join with Google.");
    } else {
      googleLogin();
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const { data } = await api.post("/auth/google", {
          access_token: tokenResponse.access_token,
          username: formData.username,
        });
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } catch (error) {
        console.error("Google signup error:", error);
        alert(error.response?.data?.message || "Google signup failed");
      }
      setIsLoading(false);
    },
  });

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col relative overflow-x-hidden">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-6 py-10 pt-20 relative z-10">
        <div className="w-full max-w-sm md:max-w-5xl">
          <Card className="overflow-hidden p-0 border-none shadow-2xl rounded-3xl bg-background">
            <CardContent className="grid p-0 md:grid-cols-[1.5fr_1fr]">
              {isSubmitted ? (
                <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Identity Verified!</h2>
                    <p className="text-muted-foreground font-medium">Welcome explorer, your digital passport is ready.</p>
                  </div>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="h-14 w-full max-w-[240px] rounded-2xl font-black bg-amber-500 hover:bg-amber-600 text-black shadow-lg transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
                  >
                    Enter Dashboard
                  </Button>
                </div>
              ) : (
                <form className="p-8 md:p-12 flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col items-start gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">{t("auth.signup.title")}</h1>
                    <p className="text-sm text-muted-foreground font-medium">{t("auth.signup.subtitle")}</p>
                  </div>

                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel htmlFor="name">{t("auth.signup.name")}</FieldLabel>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="h-10 rounded-xl" />
                      {errors.name && <FieldError>{errors.name}</FieldError>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="username">{t("Tours")}</FieldLabel>
                      <Input id="username" name="username" value={formData.username} onChange={handleChange} required className="h-10 rounded-xl" />
                      {errors.username && <FieldError>{errors.username}</FieldError>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="email">{t("auth.login.email")}</FieldLabel>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="h-10 rounded-xl" />
                      {errors.email && <FieldError>{errors.email}</FieldError>}
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="password">{t("auth.login.password")}</FieldLabel>
                        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="h-10 rounded-xl" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="confirmPassword">{t("common.confirm")}</FieldLabel>
                        <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="h-10 rounded-xl" />
                      </Field>
                    </div>

                    <Button type="submit" disabled={isLoading} className="h-12 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-md mt-4">
                      {isLoading ? t("common.creating") : t("auth.signup.submit")}
                    </Button>

                    <Button type="button" onClick={handleGoogleClick} variant="outline" className="h-10 w-full rounded-xl font-bold bg-secondary flex items-center justify-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" /></svg>
                      Continue with Google
                    </Button>

                    <p className="text-center text-xs font-medium">{t("auth.signup.hasAccount")} <Link to="/login" className="text-primary font-bold hover:underline">{t("Log In")}</Link></p>
                  </FieldGroup>
                </form>
              )}

              <div className="relative hidden md:flex flex-col bg-neutral-900 text-white overflow-hidden p-0">
                <AnimatePresence mode="wait">
                  <motion.div key={dest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0">
                    <img src={dest.image} alt={dest.title} className="h-full w-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/50" />
                  </motion.div>
                </AnimatePresence>

                <div className="relative z-10 flex flex-col h-full w-full p-8 justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80">{dest.pass}</p>
                    <h2 className="text-2xl font-black tracking-tight">{dest.title}</h2>
                  </div>

                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center px-0">
                    <div className="w-5 h-10 bg-neutral-950 rounded-r-full -ml-[10px]" />
                    <div className="flex-grow border-t-2 border-dashed border-white/20 mx-1" />
                    <div className="w-5 h-10 bg-neutral-950 rounded-l-full -mr-[10px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-y-6 pt-12 text-blue-50">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Traveler</p>
                      <p className="text-sm font-bold">{formData.name || "New Explorer"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Flight</p>
                      <p className="text-sm font-bold">{dest.flight}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Destination</p>
                      <p className="text-sm font-bold font-mono">{dest.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Gate</p>
                      <p className="text-sm font-bold">{dest.gate}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider text-white/40">Issue Date</p>
                      <p className="text-xs font-medium">October 12, 2024</p>
                    </div>
                    <div className="w-12 h-12 bg-white p-1 rounded-lg">
                      <svg viewBox="0 0 100 100" fill="black"><rect x="10" y="10" width="20" height="20" /><rect x="70" y="10" width="20" height="20" /><rect x="40" y="40" width="20" height="20" /><rect x="10" y="70" width="20" height="20" /><rect x="70" y="70" width="20" height="20" /></svg>
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

export default Signup;
