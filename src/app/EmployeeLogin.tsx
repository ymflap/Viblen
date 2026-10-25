import { useState } from "react";
import type { FormEvent } from "react";
import type { Language } from "../i18n";

type EmployeeLoginProps = {
  language: Language;
};

type LoginValues = {
  email: string;
  password: string;
};

const translations = {
  ar: {
    brand: "ڤيبلن",
    title: "تسجيل دخول الموظفين",
    subtitle: "سجّل الدخول باستخدام بيانات حساب الموظف الخاص بك.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    emailPlaceholder: "name@example.com",
    passwordPlaceholder: "أدخل كلمة المرور",
    submit: "تسجيل الدخول",
    signup: "إنشاء حساب موظف",
    required: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
    notConnected:
      "واجهة تسجيل الدخول جاهزة، لكن تسجيل الدخول الفعلي لم يُربط بالخادم بعد.",
    security:
      "سيتم التحقق من بيانات الحساب وصلاحيات الموظف على الخادم بعد ربط خدمة المصادقة.",
    employeeOnly: "بوابة الموظفين",
  },
  en: {
    brand: "Viblen",
    title: "Employee Sign In",
    subtitle: "Sign in using your employee account credentials.",
    email: "Email address",
    password: "Password",
    emailPlaceholder: "name@example.com",
    passwordPlaceholder: "Enter your password",
    submit: "Sign in",
    signup: "Create employee account",
    required: "Enter your email address and password.",
    invalidEmail: "Enter a valid email address.",
    notConnected:
      "The login interface is ready, but actual sign-in has not been connected to the server yet.",
    security:
      "Account credentials and employee permissions will be verified by the server once authentication is connected.",
    employeeOnly: "Employee portal",
  },
} satisfies Record<Language, Record<string, string>>;

export default function EmployeeLogin({
  language,
}: EmployeeLoginProps) {
  const t = translations[language];
  const isArabic = language === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError(t.required);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setError(t.invalidEmail);
      return;
    }

    setNotice(t.notConnected);
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    minHeight: "47px",
    padding: "12px 13px",
    border: "1px solid #e2e6ef",
    borderRadius: "10px",
    background: "#fff",
    color: "#172033",
    fontSize: "14px",
    outlineColor: "#6256e8",
  } as const;

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#30394d",
    fontSize: "13px",
    fontWeight: 650,
  } as const;

  return (
    <main
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background:
          "radial-gradient(circle at top, #eeecff 0, #f5f7fb 48%, #f5f7fb 100%)",
        color: "#172033",
        fontFamily:
          '"Segoe UI", Tahoma, Arial, sans-serif',
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "30px",
          border: "1px solid #e8ebf2",
          borderRadius: "20px",
          background: "#fff",
          boxShadow: "0 18px 55px rgb(40 36 90 / 8%)",
        }}
      >
        <header style={{ marginBottom: "27px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
              marginBottom: "27px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                display: "grid",
                width: "45px",
                height: "45px",
                placeItems: "center",
                borderRadius: "14px",
                background:
                  "linear-gradient(145deg, #786cf7, #5144d2)",
                color: "#fff",
                fontSize: "25px",
                fontWeight: 800,
              }}
            >
              V
            </div>

            <strong
              style={{
                fontSize: "21px",
                fontWeight: 800,
              }}
            >
              {t.brand}
            </strong>
          </div>

          <span
            style={{
              display: "inline-block",
              marginBottom: "10px",
              padding: "6px 10px",
              border: "1px solid #e8e5ff",
              borderRadius: "20px",
              background: "#f5f3ff",
              color: "#6256e8",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {t.employeeOnly}
          </span>

          <h1
            style={{
              margin: "0 0 9px",
              fontSize: "25px",
              lineHeight: 1.5,
              fontWeight: 800,
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#778197",
              fontSize: "13px",
              lineHeight: 1.9,
            }}
          >
            {t.subtitle}
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "18px" }}>
            <label htmlFor="login-email" style={labelStyle}>
              {t.email}
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              maxLength={254}
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setNotice("");
              }}
              placeholder={t.emailPlaceholder}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              htmlFor="login-password"
              style={labelStyle}
            >
              {t.password}
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={128}
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
                setNotice("");
              }}
              placeholder={t.passwordPlaceholder}
              style={inputStyle}
            />
          </div>

          {error && (
            <p
              role="alert"
              style={{
                margin: "0 0 15px",
                padding: "11px 12px",
                borderRadius: "9px",
                background: "#fff0f0",
                color: "#b42318",
                fontSize: "12px",
                lineHeight: 1.8,
              }}
            >
              {error}
            </p>
          )}

          {notice && (
            <p
              role="status"
              style={{
                margin: "0 0 15px",
                padding: "12px",
                border: "1px solid #f2d9a6",
                borderRadius: "9px",
                background: "#fff9eb",
                color: "#815b16",
                fontSize: "12px",
                lineHeight: 1.9,
              }}
            >
              {notice}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              minHeight: "48px",
              padding: "12px 16px",
              border: 0,
              borderRadius: "11px",
              background:
                "linear-gradient(135deg, #7165f1, #5144d2)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 750,
              cursor: "pointer",
            }}
          >
            {t.submit}
          </button>
        </form>

        <p
          style={{
            margin: "18px 0 0",
            color: "#778197",
            fontSize: "11px",
            lineHeight: 1.9,
            textAlign: "center",
          }}
        >
          {t.security}
        </p>

        <div
          style={{
            marginTop: "20px",
            paddingTop: "17px",
            borderTop: "1px solid #edf0f5",
            textAlign: "center",
          }}
        >
          <a
            href="/employee/signup"
            style={{
              color: "#6256e8",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            {t.signup}
          </a>
        </div>
      </section>
    </main>
  );
  }
        
