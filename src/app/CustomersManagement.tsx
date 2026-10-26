
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Language } from "../i18n";

type CustomersManagementProps = {
  language: Language;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

type CustomerForm = Omit<Customer, "id">;

type CustomerPage =
  | "customers"
  | "balances"
  | "analytics"
  | "loyalty"
  | "invoices"
  | "transactions"
  | "details";

const emptyForm: CustomerForm = {
  name: "",
  phone: "",
  email: "",
  notes: "",
};

const pages: {
  key: CustomerPage;
  ar: string;
  en: string;
  icon: string;
}[] = [
  { key: "customers", ar: "قائمة العملاء", en: "Customers", icon: "♙" },
  { key: "balances", ar: "المبالغ المستحقة", en: "Outstanding balances", icon: "◈" },
  { key: "analytics", ar: "تحليل العملاء", en: "Customer analytics", icon: "▥" },
  { key: "loyalty", ar: "الولاء والمكافآت", en: "Loyalty and rewards", icon: "☆" },
  { key: "invoices", ar: "سجل الفواتير", en: "Invoice history", icon: "▤" },
  { key: "transactions", ar: "سجل التعاملات", en: "Transaction history", icon: "↻" },
  { key: "details", ar: "تفاصيل العميل", en: "Customer details", icon: "◎" },
];

export default function CustomersManagement({
  language,
}: CustomersManagementProps) {
  const isArabic = language === "ar";

  const [activePage, setActivePage] =
    useState<CustomerPage>("customers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerForm>({ ...emptyForm });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const text = {
    title: isArabic ? "إدارة العملاء" : "Customer management",
    description: isArabic
      ? "إدارة بيانات العملاء ومتابعة تعاملاتهم."
      : "Manage customer profiles and follow their transactions.",
    add: isArabic ? "إضافة عميل" : "Add customer",
    edit: isArabic ? "تعديل" : "Edit",
    remove: isArabic ? "حذف" : "Delete",
    save: isArabic ? "حفظ العميل" : "Save customer",
    cancel: isArabic ? "إلغاء" : "Cancel",
    name: isArabic ? "اسم العميل" : "Customer name",
    phone: isArabic ? "رقم الهاتف" : "Phone number",
    email: isArabic ? "البريد الإلكتروني" : "Email address",
    notes: isArabic ? "ملاحظات" : "Notes",
    search: isArabic
      ? "ابحث بالاسم أو الهاتف أو البريد الإلكتروني..."
      : "Search by name, phone, or email...",
    count: isArabic ? "عدد العملاء" : "Customer count",
    empty: isArabic
      ? "لا يوجد عملاء مسجلون بعد. يمكنك إضافة أول عميل."
      : "No customers yet. Add your first customer.",
    noResults: isArabic
      ? "لا توجد نتائج مطابقة."
      : "No matching customers found.",
    required: isArabic
      ? "اسم العميل مطلوب."
      : "Customer name is required.",
    duplicate: isArabic
      ? "رقم الهاتف مستخدم لدى عميل آخر."
      : "This phone number belongs to another customer.",
    saved: isArabic
      ? "تم حفظ بيانات العميل في حالة الصفحة الحالية."
      : "Customer updated in the current page state.",
    confirmDelete: isArabic
      ? "هل تريد حذف هذا العميل من القائمة الحالية؟"
      : "Remove this customer from the current list?",
    notReady: isArabic
      ? "سيتم تنفيذ هذه الصفحة وربطها ببيانات النظام في مرحلة مستقلة."
      : "This page will be implemented and connected to system data in a separate step.",
    localNotice: isArabic
      ? "تنبيه: البيانات الحالية مؤقتة داخل الصفحة وليست محفوظة في قاعدة بيانات."
      : "Notice: this page currently keeps data in memory only; it is not saved to a database.",
    actions: isArabic ? "الإجراءات" : "Actions",
  };

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return customers.filter((customer) =>
      [customer.name, customer.phone, customer.email].some((value) =>
        value.toLocaleLowerCase().includes(query),
      ),
    );
  }, [customers, search]);

  const activePageInfo = pages.find(
    (page) => page.key === activePage,
  )!;

  function startAdd() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function startEdit(customer: Customer) {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      notes: customer.notes,
    });
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function saveCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();

    if (!name) {
      setError(text.required);
      return;
    }

    const duplicatePhone =
      phone !== "" &&
      customers.some(
        (customer) =>
          customer.phone.trim() === phone &&
          customer.id !== editingId,
      );

    if (duplicatePhone) {
      setError(text.duplicate);
      return;
    }

    const customer: Customer = {
      id: editingId ?? crypto.randomUUID(),
      name,
      phone,
      email,
      notes: form.notes.trim(),
    };

    setCustomers((current) =>
      editingId
        ? current.map((item) =>
            item.id === editingId ? customer : item,
          )
        : [...current, customer],
    );

    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setNotice(text.saved);
  }

  function removeCustomer(id: string) {
    if (!window.confirm(text.confirmDelete)) return;

    setCustomers((current) =>
      current.filter((customer) => customer.id !== id),
    );
    setNotice("");
  }

  return (
    <div className="customers-module" dir={isArabic ? "rtl" : "ltr"}>
      <style>{`
        .customers-module {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 22px;
          color: var(--text, #172033);
        }
        .customers-module * { box-sizing: border-box; }
        .customers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }
        .customers-header h1 {
          margin: 0 0 8px;
          font-size: clamp(22px, 3vw, 30px);
        }
        .customers-header p, .customers-muted {
          margin: 0;
          color: var(--muted, #778197);
          line-height: 1.7;
          font-size: 13px;
        }
        .customers-layout {
          display: grid;
          grid-template-columns: 210px minmax(0, 1fr);
          gap: 20px;
          align-items: start;
        }
        .customers-subnav, .customers-panel {
          min-width: 0;
          background: var(--surface, #fff);
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 16px;
          padding: 16px;
        }
        .customers-subnav h2 {
          margin: 0 0 12px;
          font-size: 14px;
        }
        .customers-subnav-list {
          display: grid;
          gap: 5px;
        }
        .customers-subnav button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 10px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: inherit;
          text-align: start;
          cursor: pointer;
          font-size: 12px;
        }
        .customers-subnav button[aria-current="page"] {
          background: #f0eeff;
          color: #5144d2;
          font-weight: 700;
        }
        .customers-subnav button:hover { background: #f7f6ff; }
        .customers-page-icon {
          width: 20px;
          text-align: center;
          font-size: 17px;
        }
        .customers-panel h2 {
          margin: 0 0 8px;
          font-size: 18px;
        }
        .customers-toolbar {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin: 18px 0;
        }
        .customers-toolbar input {
          flex: 1 1 230px;
          min-width: 0;
        }
        .customers-module input, .customers-module textarea {
          width: 100%;
          min-height: 42px;
          padding: 10px 12px;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 9px;
          background: var(--surface, #fff);
          color: inherit;
          font-size: 13px;
        }
        .customers-module textarea {
          min-height: 85px;
          resize: vertical;
        }
        .customers-module label {
          display: grid;
          gap: 7px;
          font-size: 12px;
          font-weight: 600;
        }
        .customers-button {
          min-height: 40px;
          padding: 9px 14px;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 9px;
          background: var(--surface, #fff);
          color: inherit;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }
        .customers-button-primary {
          border-color: #6256e8;
          background: #6256e8;
          color: white;
        }
        .customers-button:hover { filter: brightness(.97); }
        .customers-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 12px;
          background: #fafaff;
        }
        .customers-stats strong { font-size: 22px; }
        .customers-table-wrap {
          width: 100%;
          overflow-x: auto;
        }
        .customers-module table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          white-space: nowrap;
        }
        .customers-module th, .customers-module td {
          padding: 12px 10px;
          border-bottom: 1px solid var(--border, #e8ebf2);
          text-align: start;
        }
        .customers-module th {
          color: var(--muted, #778197);
          font-weight: 700;
          background: #fafbfe;
        }
        .customers-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin: 18px 0;
          padding: 16px;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 12px;
        }
        .customers-form .full-width { grid-column: 1 / -1; }
        .customers-form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          grid-column: 1 / -1;
        }
        .customers-alert {
          margin: 12px 0;
          padding: 11px 13px;
          border-radius: 9px;
          background: #f0f9f4;
          color: #176b45;
          font-size: 12px;
          line-height: 1.7;
        }
        .customers-error { background: #fff1f1; color: #b42318; }
        .customers-empty {
          padding: 28px 12px;
          color: var(--muted, #778197);
          text-align: center;
          line-height: 1.8;
          font-size: 13px;
        }
        @media (max-width: 760px) {
          .customers-layout { grid-template-columns: minmax(0, 1fr); }
          .customers-subnav-list {
            display: flex;
            overflow-x: auto;
            padding-bottom: 5px;
          }
          .customers-subnav-list button {
            flex: 0 0 auto;
            width: auto;
            white-space: nowrap;
          }
          .customers-form { grid-template-columns: minmax(0, 1fr); }
          .customers-form .full-width, .customers-form-actions {
            grid-column: auto;
          }
        }
      `}</style>

      <header className="customers-header">
        <div>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>
        {activePage === "customers" && !formOpen && (
          <button
            type="button"
            className="customers-button customers-button-primary"
            onClick={startAdd}
          >
            + {text.add}
          </button>
        )}
      </header>

      <div className="customers-layout">
        <aside className="customers-subnav" aria-label={text.title}>
          <h2>{isArabic ? "أقسام إدارة العملاء" : "Customer sections"}</h2>
          <nav className="customers-subnav-list">
            {pages.map((page) => (
              <button
                type="button"
                key={page.key}
                aria-current={activePage === page.key ? "page" : undefined}
                onClick={() => {
                  setActivePage(page.key);
                  setFormOpen(false);
                  setError("");
                  setNotice("");
                }}
              >
                <span className="customers-page-icon" aria-hidden="true">
                  {page.icon}
                </span>
                <span>{isArabic ? page.ar : page.en}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="customers-panel">
          {activePage === "customers" ? (
            <>
              <h2>{activePageInfo[isArabic ? "ar" : "en"]}</h2>
              <p className="customers-muted">{text.description}</p>

              <div className="customers-stats">
                <span>{text.count}</span>
                <strong>{customers.length}</strong>
              </div>

              {notice && (
                <p className="customers-alert" role="status">{notice}</p>
              )}

              {formOpen && (
                <form className="customers-form" onSubmit={saveCustomer}>
                  <label>
                    {text.name} *
                    <input
                      required
                      autoFocus
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    {text.phone}
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        setForm({ ...form, phone: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    {text.email}
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm({ ...form, email: event.target.value })
                      }
                    />
                  </label>
                  <label className="full-width">
                    {text.notes}
                    <textarea
                      value={form.notes}
                      onChange={(event) =>
                        setForm({ ...form, notes: event.target.value })
                      }
                    />
                  </label>

                  {error && (
                    <p className="customers-alert customers-error full-width" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="customers-form-actions">
                    <button className="customers-button customers-button-primary" type="submit">
                      {text.save}
                    </button>
                    <button
                      className="customers-button"
                      type="button"
                      onClick={() => {
                        setFormOpen(false);
                        setError("");
                      }}
                    >
                      {text.cancel}
                    </button>
                  </div>
                </form>
              )}

              <div className="customers-toolbar">
                <input
                  type="search"
                  aria-label={text.search}
                  placeholder={text.search}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              {customers.length === 0 ? (
                <div className="customers-empty">{text.empty}</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="customers-empty">{text.noResults}</div>
              ) : (
                <div className="customers-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{text.name}</th>
                        <th>{text.phone}</th>
                        <th>{text.email}</th>
                        <th>{text.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id}>
                          <td>{customer.name}</td>
                          <td>{customer.phone || "—"}</td>
                          <td>{customer.email || "—"}</td>
                          <td>
                            <button
                              className="customers-button"
                              type="button"
                              onClick={() => startEdit(customer)}
                            >
                              {text.edit}
                            </button>{" "}
                            <button
                              className="customers-button"
                              type="button"
                              onClick={() => removeCustomer(customer.id)}
                            >
                              {text.remove}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="customers-muted" style={{ marginTop: 16 }}>
                {text.localNotice}
              </p>
            </>
          ) : (
            <>
              <h2>{activePageInfo[isArabic ? "ar" : "en"]}</h2>
              <p className="customers-muted">{text.notReady}</p>
              <div className="customers-empty">
                {text.notReady}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
  }
    
