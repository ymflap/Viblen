import type { Language } from "../i18n";

type OwnerDashboardProps = {
  language: Language;
};

type DashboardItem = {
  icon: string;
  title: string;
  description: string;
  status: string;
};

export default function OwnerDashboard({
  language,
}: OwnerDashboardProps) {
  const isArabic = language === "ar";

  const text = {
    brand: isArabic ? "ڤيبلن" : "Viblen",
    portal: isArabic ? "لوحة إدارة المالك" : "Owner Dashboard",
    welcome: isArabic
      ? "مرحبًا بك في لوحة الإدارة"
      : "Welcome to your dashboard",
    subtitle: isArabic
      ? "إدارة شركتك ومنتجاتك ومبيعاتك من مكان واحد."
      : "Manage your company, products, and sales in one place.",
    demo: isArabic
      ? "البيانات غير متصلة بعد"
      : "Data is not connected yet",
    demoDescription: isArabic
      ? "ستظهر الأرقام الفعلية بعد ربط قاعدة البيانات."
      : "Real figures will appear after connecting the database.",
    overview: isArabic ? "ملخص النشاط" : "Business overview",
    products: isArabic ? "المنتجات" : "Products",
    sales: isArabic ? "المبيعات" : "Sales",
    inventory: isArabic ? "المخزون" : "Inventory",
    employees: isArabic ? "الموظفون" : "Employees",
    modules: isArabic ? "أقسام الإدارة" : "Management modules",
    modulesDescription: isArabic
      ? "أقسام مستقلة سيتم تجهيز واجهاتها وربطها لاحقًا."
      : "Independent sections whose interfaces will be connected later.",
    pending: isArabic ? "قيد التجهيز" : "In preparation",
    notAvailable: isArabic
      ? "لا توجد بيانات فعلية للعرض حاليًا."
      : "No live data is available yet.",
    footer: isArabic
      ? "واجهة تجريبية — لا تمثل أرقامًا أو عمليات بيع فعلية."
      : "Preview interface — figures and sales are not real.",
  };

  const items: DashboardItem[] = [
    {
      icon: "▦",
      title: isArabic ? "إدارة المنتجات" : "Product management",
      description: isArabic
        ? "إدارة أسماء المنتجات والباركود والأسعار والخصومات."
        : "Manage product names, barcodes, prices, and discounts.",
      status: text.pending,
    },
    {
      icon: "▤",
      title: isArabic ? "المبيعات والفواتير" : "Sales and invoices",
      description: isArabic
        ? "متابعة عمليات البيع والفواتير المسجلة."
        : "Review sales transactions and recorded invoices.",
      status: text.pending,
    },
    {
      icon: "▥",
      title: isArabic ? "إدارة المخزون" : "Inventory management",
      description: isArabic
        ? "متابعة الكميات وحركة المخزون."
        : "Track stock quantities and inventory movements.",
      status: text.pending,
    },
    {
      icon: "♙",
      title: isArabic ? "العملاء" : "Customers",
      description: isArabic
        ? "تنظيم بيانات العملاء وسجل تعاملاتهم."
        : "Organize customer information and activity.",
      status: text.pending,
    },
    {
      icon: "♧",
      title: isArabic ? "الموظفون والصلاحيات" : "Employees and permissions",
      description: isArabic
        ? "إدارة الموظفين وتحديد صلاحيات كل موظف."
        : "Manage employees and assign individual permissions.",
      status: text.pending,
    },
    {
      icon: "▧",
      title: isArabic ? "التقارير" : "Reports",
      description: isArabic
        ? "عرض ملخصات المبيعات والمخزون والأداء."
        : "Review sales, inventory, and performance summaries.",
      status: text.pending,
    },
    {
      icon: "⚙",
      title: isArabic ? "إعدادات الشركة" : "Company settings",
      description: isArabic
        ? "إعداد بيانات الشركة وتفضيلات النظام."
        : "Configure company details and system preferences.",
      status: text.pending,
    },
  ];

  const cardStyle = {
    minWidth: 0,
    padding: "20px",
    border: "1px solid #e8ebf2",
    borderRadius: "16px",
    background: "#ffffff",
  } as const;

  return (
    <main
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f5f7fb",
        color: "#172033",
        fontFamily: '"Segoe UI", Tahoma, Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                display: "grid",
                width: "46px",
                height: "46px",
                placeItems: "center",
                borderRadius: "14px",
                background: "linear-gradient(145deg, #786cf7, #5144d2)",
                color: "#ffffff",
                fontSize: "25px",
                fontWeight: 800,
              }}
            >
              V
            </div>

            <div>
              <strong style={{ fontSize: "21px" }}>
                {text.brand}
              </strong>
              <div
                style={{
                  marginTop: "4px",
                  color: "#778197",
                  fontSize: "12px",
                }}
              >
                {text.portal}
              </div>
            </div>
          </div>

          <span
            style={{
              padding: "9px 12px",
              border: "1px solid #f0d9a5",
              borderRadius: "10px",
              background: "#fff8e8",
              color: "#805b16",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {text.demo}
          </span>
        </header>

        <section
          style={{
            padding: "30px",
            marginBottom: "28px",
            border: "1px solid #e8e5ff",
            borderRadius: "20px",
            background:
              "linear-gradient(120deg, #ffffff 35%, #f1efff 100%)",
          }}
        >
          <span
            style={{
              color: "#6256e8",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {text.overview}
          </span>

          <h1
            style={{
              margin: "12px 0 8px",
              fontSize: "clamp(23px, 4vw, 32px)",
              lineHeight: 1.5,
            }}
          >
            {text.welcome}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#778197",
              fontSize: "14px",
              lineHeight: 1.9,
            }}
          >
            {text.subtitle}
          </p>

          <div
            role="status"
            style={{
              marginTop: "22px",
              padding: "13px 15px",
              borderRadius: "10px",
              background: "#f7f6ff",
              color: "#6256e8",
              fontSize: "12px",
              lineHeight: 1.9,
            }}
          >
            {text.demoDescription}
          </div>
        </section>

        <section aria-labelledby="owner-summary-title">
          <h2
            id="owner-summary-title"
            style={{
              margin: "0 0 16px",
              fontSize: "19px",
            }}
          >
            {text.overview}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
              gap: "16px",
              marginBottom: "34px",
            }}
          >
            {[
              { label: text.products, icon: "▦" },
              { label: text.sales, icon: "▤" },
              { label: text.inventory, icon: "▥" },
              { label: text.employees, icon: "♙" },
            ].map((stat) => (
              <article key={stat.label} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      color: "#778197",
                      fontSize: "13px",
                    }}
                  >
                    {stat.label}
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      display: "grid",
                      width: "38px",
                      height: "38px",
                      placeItems: "center",
                      borderRadius: "11px",
                      background: "#f0eeff",
                      color: "#6256e8",
                      fontSize: "20px",
                    }}
                  >
                    {stat.icon}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    fontSize: "27px",
                    fontWeight: 800,
                    color: "#929bad",
                  }}
                >
                  —
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    color: "#929bad",
                    fontSize: "11px",
                  }}
                >
                  {text.notAvailable}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="owner-modules-title">
          <h2
            id="owner-modules-title"
            style={{
              margin: "0 0 8px",
              fontSize: "19px",
            }}
          >
            {text.modules}
          </h2>

          <p
            style={{
              margin: "0 0 18px",
              color: "#778197",
              fontSize: "13px",
              lineHeight: 1.8,
            }}
          >
            {text.modulesDescription}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "16px",
            }}
          >
            {items.map((item) => (
              <article
                key={item.title}
                style={{
                  ...cardStyle,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    width: "44px",
                    height: "44px",
                    flex: "0 0 44px",
                    placeItems: "center",
                    borderRadius: "13px",
                    background: "#f0eeff",
                    color: "#6256e8",
                    fontSize: "23px",
                  }}
                >
                  {item.icon}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3
                    style={{
                      margin: "1px 0 8px",
                      fontSize: "14px",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      margin: "0 0 13px",
                      color: "#778197",
                      fontSize: "12px",
                      lineHeight: 1.9,
                    }}
                  >
                    {item.description}
                  </p>

                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 8px",
                      borderRadius: "7px",
                      background: "#f4f5f8",
                      color: "#778197",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer
          style={{
            marginTop: "28px",
            padding: "18px 0 8px",
            borderTop: "1px solid #e8ebf2",
            color: "#929bad",
            fontSize: "11px",
            lineHeight: 1.9,
            textAlign: "center",
          }}
        >
          {text.footer}
        </footer>
      </div>
    </main>
  );
    }
    
