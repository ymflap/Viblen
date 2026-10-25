import { useState, type FormEvent } from "react";
import type { Language } from "../i18n";

type OwnerSignupProps = {
  language: Language;
};

export default function OwnerSignup({
  language,
}: OwnerSignupProps) {
  const isArabic = language === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const text = {
    title: isArabic ? "إنشاء حساب المالك" : "Create Owner Account",
    subtitle: isArabic
      ? "أنشئ حسابك لإدارة شركتك وموظفيك."
      : "Create an account to manage your company and employees.",
    name: isArabic ? "الاسم الكامل" : "Full name",
    email: isArabic ? "البريد الإلكتروني" : "Email address",
    password: isArabic ? "كلمة المرور" : "Password",
    confirm: isArabic ? "تأكيد كلمة المرور" : "Confirm password",
    submit: isArabic ? "إنشاء الحساب" : "Create account",
    required: isArabic
      ? "يرجى ملء جميع الحقول."
      : "Please complete all fields.",
    invalidEmail: isArabic
      ? "يرجى إدخال بريد إلكتروني صحيح."
      : "Please enter a valid email address.",
    shortPassword: isArabic
      ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."
      : "Password must contain at least 8 characters.",
    mismatch: isArabic
      ? "كلمتا المرور غير متطابقتين."
      : "Passwords do not match.",
    unavailable: isArabic
      ? "تم التحقق من البيانات محليًا، لكن إنشاء الحساب غير متاح بعد. يجب ربط خادم آمن لتسجيل الحساب."
      : "Your information was checked locally, but account creation is not available yet. A secure backend must be connected.",
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setMessage(text.required);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setMessage(text.invalidEmail);
      return;
    }

    if (password.length < 8) {
      setMessage(text.shortPassword);
      return;
    }

    if (password !== confirmPassword) {
      setMessage(text.mismatch);
      return;
    }

    setMessage(text.unavailable);
  }

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px",
    border: "1px solid var(--border, #d1d5db)",
    borderRadius: "10px",
    background: "var(--surface, #ffffff)",
    color: "var(--text, #111827)",
    fontSize: "16px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: 600 as const,
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        width: "100%",
        maxWidth: "460px",
        margin: "0 auto",
        padding: "24px 16px",
        boxSizing: "border-box",
        color: "var(--text, #111827)",
      }}
    >
      <section
        style={{
          padding: "24px",
          border: "1px solid var(--border, #e5e7eb)",
          borderRadius: "18px",
          background: "var(--surface, #ffffff)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>
          {text.title}
        </h1>

        <p style={{ opacity: 0.75, lineHeight: 1.7 }}>
          {text.subtitle}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="owner-name" style={labelStyle}>
              {text.name}
            </label>
            <input
              id="owner-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="owner-email" style={labelStyle}>
              {text.email}
            </label>
            <input
              id="owner-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="owner-password" style={labelStyle}>
              {text.password}
            </label>
            <input
              id="owner-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="owner-confirm-password"
              style={labelStyle}
            >
              {text.confirm}
            </label>
            <input
              id="owner-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              style={fieldStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px 16px",
              border: "none",
              borderRadius: "10px",
              background: "var(--primary, #2563eb)",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {text.submit}
          </button>
        </form>

        {message && (
          <p
            role="status"
            aria-live="polite"
            style={{
              marginTop: "18px",
              padding: "12px",
              borderRadius: "10px",
              lineHeight: 1.7,
              overflowWrap: "anywhere",
              background: "var(--muted-surface, #f3f4f6)",
            }}
          >
            {message}
          </p>
        )}
      </section>
    </main>
  );
    }
