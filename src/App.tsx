import type { Language } from "./i18n";

type AppProps = {
  language: Language;
};

const content = {
  ar: {
    brand: "ڤيبلن",
    subtitle: "منصة إدارة الأعمال",
    workspace: "مساحة العمل",
    overview: "نظرة عامة",
    products: "المنتجات",
    sales: "المبيعات",
    inventory: "المخزون",
    invoices: "الفواتير",
    customers: "العملاء",
    employees: "الموظفون",
    reports: "التقارير",
    settings: "الإعدادات",
    dashboard: "لوحة التحكم",
    welcome: "أهلًا بك في ڤيبلن",
    description:
      "مساحة موحدة لإدارة أعمالك وفروعك ومتابعة عملياتك اليومية.",
    setupTitle: "مساحة عملك جاهزة للبدء",
    setupDescription:
      "سنجهز أقسام المنصة تدريجيًا، مع دعم العربية والإنجليزية.",
    status: "قيد التجهيز",
    language: "العربية",
    footer: "إدارة أعمالك، في مكان واحد",
  },
  en: {
    brand: "Viblen",
    subtitle: "Business Management",
    workspace: "WORKSPACE",
    overview: "Overview",
    products: "Products",
    sales: "Sales",
    inventory: "Inventory",
    invoices: "Invoices",
    customers: "Customers",
    employees: "Employees",
    reports: "Reports",
    settings: "Settings",
    dashboard: "Dashboard",
    welcome: "Welcome to Viblen",
    description:
      "One workspace to manage your business, branches, and daily operations.",
    setupTitle: "Your workspace is ready to begin",
    setupDescription:
      "We will build the platform section by section, with Arabic and English support.",
    status: "In progress",
    language: "English",
    footer: "Your business, all in one place",
  },
} as const;

const navigation = [
  { key: "overview", icon: "◫" },
  { key: "products", icon: "▦" },
  { key: "sales", icon: "↗" },
  { key: "inventory", icon: "▤" },
  { key: "invoices", icon: "▧" },
  { key: "customers", icon: "♙" },
  { key: "employees", icon: "♧" },
  { key: "reports", icon: "▥" },
  { key: "settings", icon: "⚙" },
] as const;

export default function App({ language }: AppProps) {
  const t = content[language];
  const isArabic = language === "ar";

  return (
    <div className="app-shell" dir={isArabic ? "rtl" : "ltr"}>
      <aside className="sidebar">
        <a className="brand" href="/" aria-label={t.brand}>
          <span className="brand-mark">V</span>
          <span className="brand-copy">
            <strong>{t.brand}</strong>
            <small>{t.subtitle}</small>
          </span>
        </a>

        <div className="sidebar-label">{t.workspace}</div>

        <nav className="navigation" aria-label={t.workspace}>
          {navigation.map((item, index) => (
            <a
              key={item.key}
              href="#"
              className={`nav-item ${index === 0 ? "active" : ""}`}
              aria-current={index === 0 ? "page" : undefined}
              onClick={(event) => event.preventDefault()}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{t[item.key]}</span>
              {index === 0 && <span className="active-indicator" />}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="footer-dot" />
          <span>{t.footer}</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>{t.brand}</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{t.dashboard}</strong>
          </div>

          <div className="topbar-actions">
            <span className="language-chip">
              <span aria-hidden="true">◎</span>
              {t.language}
            </span>
            <div className="profile-avatar" aria-label={t.brand}>
              {isArabic ? "ڤ" : "V"}
            </div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-section">
            <div>
              <span className="eyebrow">{t.dashboard}</span>
              <h1>{t.welcome}</h1>
              <p>{t.description}</p>
            </div>
            <div className="welcome-symbol" aria-hidden="true">
              <span>V</span>
              <i />
            </div>
          </div>

          <section className="setup-card">
            <div className="setup-icon" aria-hidden="true">
              <span>✦</span>
            </div>

            <div className="setup-copy">
              <span className="status-label">
                <span className="status-dot" />
                {t.status}
              </span>
              <h2>{t.setupTitle}</h2>
              <p>{t.setupDescription}</p>
            </div>

            <div className="setup-decoration" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </section>

          <footer className="page-footer">{t.footer}</footer>
        </section>
      </main>
    </div>
  );
    }
  
