import { useMemo, useState } from "react";
import type { Language } from "../i18n";

type CustomerAnalyticsProps = {
  language: Language;
};

type CustomerMetric = {
  id: string;
  name: string;
  phone: string;
  invoiceCount: number;
  totalSpent: number;
  lastPurchase: string;
};

const demoCustomers: CustomerMetric[] = [
  {
    id: "customer-1",
    name: "أحمد محمد",
    phone: "01000000001",
    invoiceCount: 18,
    totalSpent: 12450,
    lastPurchase: "2026-10-25",
  },
  {
    id: "customer-2",
    name: "سارة علي",
    phone: "01000000002",
    invoiceCount: 12,
    totalSpent: 8300,
    lastPurchase: "2026-10-24",
  },
  {
    id: "customer-3",
    name: "محمود حسن",
    phone: "01000000003",
    invoiceCount: 7,
    totalSpent: 4250,
    lastPurchase: "2026-10-20",
  },
  {
    id: "customer-4",
    name: "منى إبراهيم",
    phone: "01000000004",
    invoiceCount: 3,
    totalSpent: 1250,
    lastPurchase: "2026-09-30",
  },
  {
    id: "customer-5",
    name: "يوسف خالد",
    phone: "01000000005",
    invoiceCount: 1,
    totalSpent: 400,
    lastPurchase: "2026-08-15",
  },
];

function formatMoney(value: number, isArabic: boolean): string {
  return new Intl.NumberFormat(isArabic ? "ar-EG" : "en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CustomerAnalytics({
  language,
}: CustomerAnalyticsProps) {
  const isArabic = language === "ar";
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"spent" | "invoices" | "recent">(
    "spent",
  );

  const text = {
    title: isArabic ? "تحليل العملاء" : "Customer analytics",
    subtitle: isArabic
      ? "افهم سلوك الشراء وحدد العملاء الأكثر نشاطًا."
      : "Understand purchasing behavior and identify your most active customers.",
    demo: isArabic
      ? "بيانات توضيحية وليست بيانات مبيعات حقيقية."
      : "Illustrative data, not real sales data.",
    totalCustomers: isArabic ? "العملاء المعروضون" : "Customers shown",
    totalRevenue: isArabic ? "إجمالي المشتريات" : "Total purchases",
    totalInvoices: isArabic ? "عدد الفواتير" : "Invoice count",
    averageInvoice: isArabic ? "متوسط قيمة الفاتورة" : "Average invoice value",
    ranking: isArabic ? "ترتيب العملاء" : "Customer ranking",
    rankingDescription: isArabic
      ? "مقارنة العملاء وفقًا للمشتريات أو عدد الفواتير أو حداثة الشراء."
      : "Compare customers by spending, invoice count, or purchase recency.",
    search: isArabic
      ? "ابحث باسم العميل أو رقم الهاتف..."
      : "Search customer name or phone...",
    sortSpent: isArabic ? "الأعلى إنفاقًا" : "Highest spending",
    sortInvoices: isArabic ? "الأكثر فواتير" : "Most invoices",
    sortRecent: isArabic ? "الأحدث شراءً" : "Most recent purchase",
    customer: isArabic ? "العميل" : "Customer",
    phone: isArabic ? "الهاتف" : "Phone",
    invoices: isArabic ? "الفواتير" : "Invoices",
    spent: isArabic ? "إجمالي المشتريات" : "Total spent",
    lastPurchase: isArabic ? "آخر عملية شراء" : "Last purchase",
    noResults: isArabic
      ? "لا توجد نتائج مطابقة."
      : "No matching customers found.",
    topCustomers: isArabic ? "أعلى العملاء إنفاقًا" : "Top spending customers",
    activity: isArabic ? "مستوى النشاط" : "Activity level",
    high: isArabic ? "مرتفع" : "High",
    medium: isArabic ? "متوسط" : "Medium",
    low: isArabic ? "منخفض" : "Low",
    currency: isArabic ? "جنيه مصري" : "EGP",
    countLabel: isArabic ? "عميل" : "customers",
    localNotice: isArabic
      ? "سيتم احتساب المؤشرات الفعلية بعد ربط سجل الفواتير وقاعدة البيانات."
      : "Live metrics will be calculated after connecting invoice records and the database.",
  };

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return demoCustomers
      .filter((customer) =>
        [customer.name, customer.phone].some((value) =>
          value.toLocaleLowerCase().includes(query),
        ),
      )
      .sort((a, b) => {
        if (sortBy === "invoices") {
          return b.invoiceCount - a.invoiceCount;
        }

        if (sortBy === "recent") {
          return b.lastPurchase.localeCompare(a.lastPurchase);
        }

        return b.totalSpent - a.totalSpent;
      });
  }, [search, sortBy]);

  const metrics = useMemo(() => {
    const totalSpent = filteredCustomers.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0,
    );

    const totalInvoices = filteredCustomers.reduce(
      (sum, customer) => sum + customer.invoiceCount,
      0,
    );

    return {
      customerCount: filteredCustomers.length,
      totalSpent,
      totalInvoices,
      averageInvoice:
        totalInvoices > 0 ? totalSpent / totalInvoices : 0,
    };
  }, [filteredCustomers]);

  const topCustomers = [...filteredCustomers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 3);

  function getActivityLevel(invoiceCount: number): string {
    if (invoiceCount >= 10) return text.high;
    if (invoiceCount >= 4) return text.medium;
    return text.low;
  }

  function formatDate(value: string): string {
    if (!value) return "—";

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }
  
  return (
    <main
      className="customer-analytics"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
    >
      <style>{`
        .customer-analytics {
          display: grid;
          gap: 22px;
          min-width: 0;
          color: var(--text, #172033);
          font-family: "Segoe UI", Tahoma, Arial, sans-serif;
        }
        .customer-analytics * { box-sizing: border-box; }
        .ca-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }
        .ca-header h1 {
          margin: 0 0 8px;
          font-size: clamp(22px, 3vw, 30px);
        }
        .ca-muted {
          margin: 0;
          color: var(--muted, #778197);
          font-size: 13px;
          line-height: 1.8;
        }
        .ca-notice {
          padding: 12px 14px;
          border-radius: 10px;
          background: #f2f0ff;
          color: #5144d2;
          font-size: 12px;
          line-height: 1.8;
        }
        .ca-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .ca-card, .ca-panel {
          min-width: 0;
          padding: 18px;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 15px;
          background: var(--surface, #fff);
        }
        .ca-stat-label {
          color: var(--muted, #778197);
          font-size: 12px;
          line-height: 1.7;
        }
        .ca-stat-value {
          margin-top: 12px;
          font-size: clamp(19px, 2.5vw, 27px);
          font-weight: 800;
          overflow-wrap: anywhere;
        }
        .ca-panel h2 {
          margin: 0 0 8px;
          font-size: 17px;
        }
        .ca-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 18px 0;
        }
        .customer-analytics input,
        .customer-analytics select {
          min-height: 42px;
          min-width: 0;
          padding: 10px 12px;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 9px;
          background: var(--surface, #fff);
          color: inherit;
          font: inherit;
          font-size: 12px;
        }
        .ca-toolbar input {
          flex: 1 1 230px;
        }
        .ca-toolbar select {
          flex: 0 1 210px;
        }
        .ca-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 11px;
        }
        .ca-table {
          width: 100%;
          border-collapse: collapse;
          text-align: start;
          font-size: 12px;
        }
        .ca-table th, .ca-table td {
          padding: 13px 12px;
          border-bottom: 1px solid var(--border, #e8ebf2);
          text-align: start;
          white-space: nowrap;
        }
        .ca-table th {
          background: var(--table-header, #f7f8fc);
          color: var(--muted, #667085);
          font-weight: 700;
        }
        .ca-table tbody tr:last-child td { border-bottom: 0; }
        .ca-name {
          min-width: 125px;
          font-weight: 700;
        }
        .ca-pill {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 7px;
          background: #eaf8ef;
          color: #187344;
          font-size: 11px;
          font-weight: 700;
        }
        .ca-pill-medium {
          background: #fff5dc;
          color: #8a6100;
        }
        .ca-pill-low {
          background: #f0f2f6;
          color: #596579;
        }
        .ca-top-list {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }
        .ca-top-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 10px;
        }
        .ca-top-name {
          font-size: 13px;
          font-weight: 700;
          overflow-wrap: anywhere;
        }
        .ca-top-value {
          font-size: 13px;
          font-weight: 800;
          text-align: end;
        }
        .ca-empty {
          padding: 25px 12px;
          text-align: center;
          color: var(--muted, #778197);
          font-size: 13px;
        }
        @media (max-width: 900px) {
          .ca-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 480px) {
          .ca-stats { grid-template-columns: 1fr; }
          .ca-card, .ca-panel { padding: 14px; }
          .ca-toolbar select { flex: 1 1 100%; }
        }
      `}</style>

      <header className="ca-header">
        <div>
          <h1>{text.title}</h1>
          <p className="ca-muted">{text.subtitle}</p>
        </div>
      </header>

      <div className="ca-notice" role="status">
        {text.demo}
        {" "}
        {text.localNotice}
      </div>

      <section className="ca-stats">
        <article className="ca-card">
          <div className="ca-stat-label">{text.totalCustomers}</div>
          <div className="ca-stat-value">{metrics.customerCount}</div>
        </article>

        <article className="ca-card">
          <div className="ca-stat-label">{text.totalRevenue}</div>
          <div className="ca-stat-value">
            {formatMoney(metrics.totalSpent, isArabic)}
            <div className="ca-muted">{text.currency}</div>
          </div>
        </article>

        <article className="ca-card">
          <div className="ca-stat-label">{text.totalInvoices}</div>
          <div className="ca-stat-value">{metrics.totalInvoices}</div>
        </article>

        <article className="ca-card">
          <div className="ca-stat-label">{text.averageInvoice}</div>
          <div className="ca-stat-value">
            {formatMoney(metrics.averageInvoice, isArabic)}
            <div className="ca-muted">{text.currency}</div>
          </div>
        </article>
      </section>

      <section className="ca-panel">
        <h2>{text.ranking}</h2>
        <p className="ca-muted">{text.rankingDescription}</p>

        <div className="ca-toolbar">
          <input
            type="search"
            aria-label={text.search}
            placeholder={text.search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            aria-label={text.ranking}
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as "spent" | "invoices" | "recent")
            }
          >
            <option value="spent">{text.sortSpent}</option>
            <option value="invoices">{text.sortInvoices}</option>
            <option value="recent">{text.sortRecent}</option>
          </select>
        </div>

        <div className="ca-table-wrap">
          <table className="ca-table">
            <thead>
              <tr>
                <th>{text.customer}</th>
                <th>{text.phone}</th>
                <th>{text.invoices}</th>
                <th>{text.spent}</th>
                <th>{text.lastPurchase}</th>
                <th>{text.activity}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const level = getActivityLevel(customer.invoiceCount);
                const levelClass =
                  customer.invoiceCount >= 10
                    ? ""
                    : customer.invoiceCount >= 4
                      ? "ca-pill-medium"
                      : "ca-pill-low";

                return (
                  <tr key={customer.id}>
                    <td className="ca-name">{customer.name}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.invoiceCount}</td>
                    <td>
                      {formatMoney(customer.totalSpent, isArabic)}
                    </td>
                    <td>{formatDate(customer.lastPurchase)}</td>
                    <td>
                      <span className={`ca-pill ${levelClass}`}>
                        {level}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="ca-empty">{text.noResults}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ca-panel">
        <h2>{text.topCustomers}</h2>

        {topCustomers.length > 0 ? (
          <div className="ca-top-list">
            {topCustomers.map((customer, index) => (
              <article className="ca-top-item" key={customer.id}>
                <div>
                  <div className="ca-top-name">
                    {index + 1}. {customer.name}
                  </div>
                  <div className="ca-muted">
                    {customer.invoiceCount} {text.invoices}
                  </div>
                </div>

                <div className="ca-top-value">
                  {formatMoney(customer.totalSpent, isArabic)}
                  <div className="ca-muted">{text.currency}</div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="ca-empty">{text.noResults}</div>
        )}
      </section>
    </main>
  );
}
