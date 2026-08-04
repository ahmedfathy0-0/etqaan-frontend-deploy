"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Login01, View, ViewOff } from "@dga-icons/react/duotone-rounded";
import GuestRoute from "@/components/GuestRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [savePassword, setSavePassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setSavePassword(true);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await login(email, password);
      
      if (savePassword) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    }
  };

  return (
    <GuestRoute>
      <main className="min-h-screen bg-success-50 px-4 py-12 font-cairo md:flex md:items-center md:justify-center md:bg-white md:px-6 md:py-9">
        <section className="mx-auto flex w-full max-w-[600px] flex-col items-center md:max-w-[1232px] md:gap-9">
          <Image
            src="/images/logo.png"
            alt="شعار دار الرحمن"
            width={112}
            height={112}
            className="h-28 w-28 object-contain"
            priority
          />

          <div className="mt-10 flex w-full max-w-[600px] flex-col items-center gap-12 md:mt-0 md:gap-9">
            <h1 className="w-full text-center text-[40px] font-bold leading-[1.5] text-success-800 md:text-[60px]">
              تسجيل الدخول
            </h1>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6" dir="rtl">
              {error && (
                <p role="alert" className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-center text-sm text-danger-700">
                  {error}
                </p>
              )}

              <div className="flex w-full flex-col items-end gap-3">
                <label htmlFor="email" className="w-full text-right text-base font-medium leading-6 text-success-800 md:text-2xl md:font-bold md:leading-9">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Example@gmail.com"
                  autoComplete="email"
                  required
                  dir="ltr"
                  className="h-12 w-full rounded-lg border border-[#A3C3D7] bg-white px-2 text-left text-sm font-medium text-neutral-800 outline-none placeholder:text-neutral-700 focus:border-success-700 focus:ring-2 focus:ring-success-200 md:border-2 md:border-success-700"
                />
                <p className="w-full text-right text-sm leading-[21px] text-neutral-700 md:hidden">
                  أدخل البريد الإلكتروني المرتبط بحسابك
                </p>
              </div>

              <div className="flex w-full flex-col items-end gap-3">
                <label htmlFor="password" className="w-full text-right text-base font-medium leading-6 text-success-800 md:text-2xl md:font-bold md:leading-9">
                  كلمة المرور
                </label>
                <div className="flex h-12 w-full items-center rounded-lg border border-[#A3C3D7] bg-white px-2 focus-within:border-success-700 focus-within:ring-2 focus-within:ring-success-200 md:border-2 md:border-success-700">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    dir="ltr"
                    className="h-full min-w-0 flex-1 bg-transparent px-2 text-left text-sm font-medium text-neutral-800 outline-none placeholder:text-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    className="flex h-8 w-8 shrink-0 items-center justify-center text-neutral-700 hover:text-success-800 focus-visible:outline-2 focus-visible:outline-success-700"
                  >
                    {showPassword ? (
                      <ViewOff aria-hidden="true" size={22} />
                    ) : (
                      <View aria-hidden="true" size={22} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex w-full items-center gap-3 px-1 mt-1">
                <input
                  id="savePassword"
                  type="checkbox"
                  checked={savePassword}
                  onChange={(e) => setSavePassword(e.target.checked)}
                  className="h-5 w-5 rounded border-[#A3C3D7] text-success-700 focus:ring-success-700 cursor-pointer"
                />
                <label htmlFor="savePassword" className="text-sm font-bold text-success-800 cursor-pointer select-none">
                  حفظ كلمة المرور
                </label>
              </div>

              <div className="mt-6 flex w-full flex-col gap-4 md:mt-0">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-14 w-full items-center justify-center gap-4 rounded-2xl bg-success-800 px-4 text-lg font-bold text-success-50 transition-colors hover:bg-success-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    <>
                      <Login01 aria-hidden="true" size={24} />
                      تسجيل الدخول
                    </>
                  )}
                </button>

                <Link
                  href="/batches"
                  className="flex h-14 w-full items-center justify-center rounded-2xl border-2 border-warning-600 px-4 text-lg font-bold text-success-900 transition-colors hover:bg-warning-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning-600"
                >
                  تصفح بدون حساب
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </GuestRoute>
  );
}
