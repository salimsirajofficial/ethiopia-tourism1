import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import AdminDashboard from "./AdminDashboard";
import { Card, CardContent } from "../components/ui/card";

const Admin = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists, verify it if possible, else just assume false
    // Since it's a specific admin entry, we can be slightly strict.
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      // We set a unique admin token to separate user session and admin session
      // or we just use the global token if they are the same user.
    }
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const { data } = await api.post("/auth/google", {
          access_token: tokenResponse.access_token,
        });
        localStorage.setItem("admin_token", data.token);
        // Also set global token so API calls work
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Admin Google login error:", error);
        alert(error.response?.data?.message || "Google login failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      console.error("Login Failed");
      alert("Google Login Failed");
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    navigate("/");
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-neutral-900 border-neutral-800 shadow-2xl rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          
          <CardContent className="p-8 md:p-10 flex flex-col items-center text-center gap-8 relative z-10">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">{t("auth.admin.portal")}</h1>
              <p className="text-sm font-medium text-neutral-400">
                {t("auth.admin.desc")}
              </p>
            </div>

            <Button
              onClick={() => googleLogin()}
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-black font-bold bg-white hover:bg-neutral-200 transition-all shadow-md flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>{t("auth.admin.gmail")}</span>
                </>
              )}
            </Button>
            
            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-600 mt-4">
              {t("auth.admin.restricted")}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Admin;
