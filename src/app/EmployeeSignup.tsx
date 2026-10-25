import { useState } from "react";
import type { FormEvent } from "react";
import type { Language } from "../i18n";

type EmployeeSignupProps = {
  language: Language;
};

type FormValues = {
  name: string;
  email: string;
  activationCode: string;
  password: string;
  confirmPassword: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  activationCode: "",
  password: "",
  confirmPassword: "",
};

const copy = {
  ar: {
    title: "إنشاء حساب موظف",
    subtitle:
      "أدخل البيانات التي حصلت عليها من مالك الشركة لإعداد حسابك.",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني المسجل لدى المالك",
    code: "كود التفعيل",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    submit: "التحقق من البيانات",
    namePlaceholder: "اكتب اسمك الكامل",
    emailPlaceholder: "name@example.com",
    codePlaceholder: "أدخل كود التفعيل",
    passwordPlaceholder: "8 أحرف على الأقل",
    confirmPlaceholder: "أعد كتابة كلمة المرور",
    required: "يرجى ملء جميع الحقول.",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
    shortPassword: "يجب ألا تقل كلمة المرور عن 8 أحرف.",
    passwordMismatch: "كلمتا المرور غير متطابقتين.",
    codeLength: "كود التفعيل مطلوب.",
    notConnected:
      "تم التحقق من تنسيق البيانات فقط. إنشاء الحساب غير متاح بعد، لأن الواجهة لم تُربط بخادم التحقق والتسجيل.",
    security:
      "سيتم التحقق من البريد وكود التفعيل وصلاحيتهما على الخادم عند ربط خدمة التسجيل.",
    ownerLink: "هذه الصفحة مخصصة للموظفين فقط.",
    brand: "ڤيبلن",
    back: "مسار الموظفين",
  },
  en: {
    title: "Create Employee Account",
    subtitle:
      "Enter the details provided by your company owner to set up your account.",
    name: "Full name",
    email: "Email registered by the owner",
    code: "Activation code",
    password: "Password",
    confirmPassword: "Confirm password",
    submit: "Validate details",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "name@example.com",
    codePlaceholder: "Enter activation code",
    passwordPlaceholder: "At least 8 characters",
    confirmPlaceholder: "Re-enter your password",
    required: "Please complete all fields.",
    invalidEmail: "Enter a valid email address.",
    shortPassword: "Password must contain at least 8 characters.",
    passwordMismatch: "Passwords do not match.",
    codeLength: "An activation code is required.",
    notConnected:
      "Only the input format has been validated. Account creation is not available yet because server-side verification and registration are not connected.",
    security:
      "The server will verify the registered email, activation code, and expiration when the registration service is connected.",
    ownerLink: "This page is for employees only.",
    brand: "Viblen",
    back: "Employee access",
  },
} satisfies Record<Language, Record<string, string>>;

export default function EmployeeSignup({
  language,
}: EmployeeSignupProps) {
  const t = copy[language];
  const isArabic = language === "ar";

  const [values, setValues] =
    useState<FormValues>({ ...initialValues });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function updateField(
    field: keyof FormValues,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
    setNotice("");
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setNotice("");

    const name = values.name.trim();
    const email = values.email.trim().toLowerCase();
    const code = values.activationCode.trim();
    const password = values.password;
    const confirmPassword = values.confirmPassword;

    if (
      !name ||
      !email ||
      !code ||
      !password ||
      !confirmPassword
    ) {
      setError(t.required);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError(t.invalidEmail);
      return;
    }

    if (code.length < 1) {
      setError(t.codeLength);
      return;
    }

    if (password.length < 8) {
      setError(t.shortPassword);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setNotice(t.notConnected);
  }

  const inputStyle = {
    width: "100%",
    minHeight: "46px",
    padding: "11px 13px",
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
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
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
          maxWidth: "460px",
          padding: "30px",
          border: "1px solid #e8ebf2",
          borderRadius: "20px",
          background: "#fff",
          boxShadow: "0 18px 55px rgb(40 36 90 / 8%)",
        }}
      >
        <header style={{ marginBottom: "25px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
              marginBottom: "25px",
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
          <div style={{ marginBottom: "17px" }}>
            <label htmlFor="employee-name" style={labelStyle}>
              {t.name}
            </label>
            <input
              id="employee-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              required
              value={values.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder={t.namePlaceholder}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "17px" }}>
            <label htmlFor="employee-email" style={labelStyle}>
              {t.email}
            </label>
            <input
              id="employee-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              required
              value={values.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              placeholder={t.emailPlaceholder}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "17px" }}>
            <label htmlFor="employee-code" style={labelStyle}>
              {t.code}
            </label>
            <input
              id="employee-code"
              name="activationCode"
              type="text"
              autoComplete="off"
              maxLength={128}
              required
              value={values.activationCode}
              onChange={(event) =>
                updateField(
                  "activationCode",
                  event.target.value,
                )
              }
              placeholder={t.codePlaceholder}
              style={{
                ...inputStyle,
                letterSpacing: isArabic ? "normal" : "1px",
              }}
            />
          </div>

          <div style={{ marginBottom: "17px" }}>
            <label
              htmlFor="employee-password"
              style={labelStyle}
            >
              {t.password}
            </label>
            <input
              id="employee-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              value={values.password}
              onChange={(event) =>
                updateField("password", event.target.value)
              }
              placeholder={t.passwordPlaceholder}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="employee-confirm-password"
              style={labelStyle}
            >
              {t.confirmPassword}
            </label>
            <input
              id="employee-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              value={values.confirmPassword}
              onChange={(event) =>
                updateField(
                  "confirmPassword",
                  event.target.value,
                )
              }
              placeholder={t.confirmPlaceholder}
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
            marginTop: "18px",
            paddingTop: "15px",
            borderTop: "1px solid #edf0f5",
            color: "#8a93a5",
            fontSize: "11px",
            textAlign: "center",
          }}
        >
          {t.ownerLink}
        </div>
      </section>
    </main>
  );
      }
    
