
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Language } from "../i18n";

type CustomerDebtsProps = {
  language: Language;
};

type DebtRecord = {
  id: string;
  customerName: string;
  phone: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  notes: string;
};

type DebtForm = Omit<DebtRecord, "id">;

const emptyForm: DebtForm = {
  customerName: "",
  phone: "",
  invoiceNumber: "",
  totalAmount: 0,
  paidAmount: 0,
  dueDate: "",
  notes: "",
};

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatMoney(amount: number, isArabic: boolean): string {
  return new Intl.NumberFormat(isArabic ? "ar-EG" : "en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CustomerDebts({
  language,
}: CustomerDebtsProps) {
  const isArabic = language === "ar";

  const [records, setRecords] = useState<DebtRecord[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DebtForm>({ ...emptyForm });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const text = {
    title: isArabic ? "المبالغ المستحقة" : "Outstanding balances",
    description: isArabic
      ? "تابع ديون العملاء والمدفوعات والمبالغ المتأخرة."
      : "Track customer debts, payments, and overdue balances.",
    add: isArabic ? "إضافة مستحق" : "Add balance",
    edit: isArabic ? "تعديل" : "Edit",
    delete: isArabic ? "حذف" : "Delete",
    save: isArabic ? "حفظ البيانات" : "Save record",
    cancel: isArabic ? "إلغاء" : "Cancel",
    customer: isArabic ? "اسم العميل" : "Customer name",
    phone: isArabic ? "رقم الهاتف" : "Phone number",
    invoice: isArabic ? "رقم الفاتورة" : "Invoice number",
    total: isArabic ? "إجمالي الفاتورة" : "Invoice total",
    paid: isArabic ? "المبلغ المدفوع" : "Amount paid",
    remaining: isArabic ? "المبلغ المتبقي" : "Remaining balance",
    dueDate: isArabic ? "تاريخ الاستحقاق" : "Due date",
    notes: isArabic ? "ملاحظات" : "Notes",
    search: isArabic
      ? "ابحث باسم العميل أو الهاتف أو رقم الفاتورة..."
      : "Search customer, phone, or invoice number...",
    totalOutstanding: isArabic
      ? "إجمالي المستحقات"
      : "Total outstanding",
    debtors: isArabic ? "العملاء المدينون" : "Customers with debt",
    overdueTotal: isArabic ? "المبالغ المتأخرة" : "Overdue amount",
    overdue: isArabic ? "متأخر" : "Overdue",
    upcoming: isArabic ? "مستحق" : "Due",
    noDueDate: isArabic ? "غير محدد" : "Not set",
    noRecords: isArabic
      ? "لا توجد مبالغ مستحقة. يمكنك إضافة أول سجل."
      : "No outstanding balances. Add the first record.",
    noResults: isArabic
      ? "لا توجد نتائج مطابقة."
      : "No matching results.",
    required: isArabic
      ? "اسم العميل مطلوب."
      : "Customer name is required.",
    invalidAmount: isArabic
      ? "أدخل إجماليًا صحيحًا أكبر من صفر، ومدفوعات غير سالبة لا تتجاوز الإجمالي."
      : "Enter a total greater than zero and a non-negative payment no greater than the total.",
    saved: isArabic
      ? "تم حفظ السجل في حالة الصفحة الحالية."
      : "Record saved in the current page state.",
    confirmDelete: isArabic
      ? "هل تريد حذف سجل المستحقات هذا؟"
      : "Delete this outstanding balance record?",
    overdueFilter: isArabic
      ? "عرض المتأخرات فقط"
      : "Show overdue only",
    allRecords: isArabic ? "كل المستحقات" : "All balances",
    actions: isArabic ? "الإجراءات" : "Actions",
    localNotice: isArabic
      ? "تنبيه: البيانات مؤقتة داخل الصفحة، ولن تُحفظ بعد إعادة تحميلها."
      : "Notice: data is temporary and will be lost when the page reloads.",
    paidInFull: isArabic
      ? "مسدد بالكامل"
      : "Paid in full",
    currency: isArabic ? "جنيه" : "EGP",
  };

  const outstandingRecords = useMemo(
    () =>
      records.filter(
        (record) => record.totalAmount - record.paidAmount > 0,
      ),
    [records],
  );

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return outstandingRecords.filter((record) => {
      const matchesSearch = [
        record.customerName,
        record.phone,
        record.invoiceNumber,
      ].some((value) => value.toLocaleLowerCase().includes(query));

      const remaining = record.totalAmount - record.paidAmount;
      const isOverdue =
        Boolean(record.dueDate) &&
        record.dueDate < getToday() &&
        remaining > 0;

      return (
        matchesSearch &&
        (!showOverdueOnly || isOverdue)
      );
    });
  }, [outstandingRecords, search, showOverdueOnly]);

  const totalOutstanding = outstandingRecords.reduce(
    (sum, record) => sum + record.totalAmount - record.paidAmount,
    0,
  );

  const overdueRecords = outstandingRecords.filter(
    (record) =>
      Boolean(record.dueDate) &&
      record.dueDate < getToday(),
  );

  const overdueTotal = overdueRecords.reduce(
    (sum, record) => sum + record.totalAmount - record.paidAmount,
    0,
  );

  function startAdd() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function startEdit(record: DebtRecord) {
    setEditingId(record.id);
    setForm({
      customerName: record.customerName,
      phone: record.phone,
      invoiceNumber: record.invoiceNumber,
      totalAmount: record.totalAmount,
      paidAmount: record.paidAmount,
      dueDate: record.dueDate,
      notes: record.notes,
    });
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const customerName = form.customerName.trim();
    const phone = form.phone.trim();
    const invoiceNumber = form.invoiceNumber.trim();
    const totalAmount = Number(form.totalAmount);
    const paidAmount = Number(form.paidAmount);

    if (!customerName) {
      setError(text.required);
      return;
    }

    if (
      !Number.isFinite(totalAmount) ||
      !Number.isFinite(paidAmount) ||
      totalAmount <= 0 ||
      paidAmount < 0 ||
      paidAmount > totalAmount
    ) {
      setError(text.invalidAmount);
      return;
    }

    const updatedRecord: DebtRecord = {
      id: editingId ?? createId(),
      customerName,
      phone,
      invoiceNumber,
      totalAmount,
      paidAmount,
      dueDate: form.dueDate,
      notes: form.notes.trim(),
    };

    setRecords((current) =>
      editingId
        ? current.map((record) =>
            record.id === editingId ? updatedRecord : record,
          )
        : [...current, updatedRecord],
    );

    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setNotice(text.saved);
  }

  function deleteRecord(id: string) {
    if (!window.confirm(text.confirmDelete)) return;

    setRecords((current) =>
      current.filter((record) => record.id !== id),
    );
    setNotice("");
  }
  
  return (
    <main
      className="customer-debts"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
    >
      <style>{`
        .customer-debts {
          display: grid;
          gap: 22px;
          width: 100%;
          min-width: 0;
          color: var(--text, #172033);
          font-family: "Segoe UI", Tahoma, Arial, sans-serif;
        }
        .customer-debts * { box-sizing: border-box; }
        .cd-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }
        .cd-header h1 {
          margin: 0 0 8px;
          font-size: clamp(22px, 3vw, 30px);
        }
        .cd-muted {
          margin: 0;
          color: var(--muted, #778197);
          font-size: 13px;
          line-height: 1.8;
        }
        .cd-button {
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
        .cd-primary {
          border-color: #6256e8;
          background: #6256e8;
          color: white;
        }
        .cd-button:hover { filter: brightness(.97); }
        .cd-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .cd-card, .cd-panel {
          min-width: 0;
          padding: 18px;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 15px;
          background: var(--surface, #fff);
        }
        .cd-stat-label {
          color: var(--muted, #778197);
          font-size: 12px;
          line-height: 1.7;
        }
        .cd-stat-value {
          margin-top: 12px;
          font-size: clamp(20px, 3vw, 27px);
          font-weight: 800;
          overflow-wrap: anywhere;
        }
        .cd-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin: 18px 0;
        }
        .customer-debts input,
        .customer-debts textarea {
          width: 100%;
          min-width: 0;
          min-height: 42px;
          padding: 10px 12px;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 9px;
          background: var(--surface, #fff);
          color: inherit;
          font: inherit;
          font-size: 13px;
        }
        .customer-debts textarea {
          min-height: 82px;
          resize: vertical;
        }
        .cd-toolbar input { flex: 1 1 250px; }
        .cd-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 40px;
          font-size: 12px;
          cursor: pointer;
        }
        .cd-filter input {
          width: 16px;
          min-height: 16px;
          accent-color: #6256e8;
        }
        .cd-form {
          display: grid;
          gap: 15px;
          padding: 18px;
          margin: 18px 0;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 12px;
          background: var(--surface, #fff);
        }
        .cd-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .cd-field {
          display: grid;
          align-content: start;
          gap: 7px;
          min-width: 0;
          font-size: 12px;
          font-weight: 600;
        }
        .cd-field-full { grid-column: 1 / -1; }
        .cd-form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }
        .cd-message {
          padding: 12px 14px;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.8;
        }
        .cd-error { background: #fff0f0; color: #b42318; }
        .cd-success { background: #eaf8ef; color: #187344; }
        .cd-notice { background: #f7f6ff; color: #5144d2; }
        .cd-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid var(--border, #e8ebf2);
          border-radius: 11px;
        }
        .cd-table {
          width: 100%;
          border-collapse: collapse;
          text-align: start;
          font-size: 12px;
        }
        .cd-table th, .cd-table td {
          padding: 13px 12px;
          border-bottom: 1px solid var(--border, #e8ebf2);
          text-align: start;
          vertical-align: middle;
          white-space: nowrap;
        }
        .cd-table th {
          background: var(--table-header, #f7f8fc);
          color: var(--muted, #667085);
          font-weight: 700;
        }
        .cd-table tbody tr:last-child td { border-bottom: 0; }
        .cd-table td.cd-customer-name {
          white-space: normal;
          min-width: 130px;
          font-weight: 700;
        }
        .cd-table .cd-remaining {
          color: #b54708;
          font-weight: 800;
        }
        .cd-status {
          display: inline-block;
          padding: 5px 8px;
          border-radius: 7px;
          background: #fff0e0;
          color: #a34c00;
          font-size: 11px;
          font-weight: 700;
        }
        .cd-empty {
          padding: 28px 14px;
          color: var(--muted, #778197);
          text-align: center;
          font-size: 13px;
          line-height: 1.9;
        }
        .cd-actions { display: flex; gap: 7px; }
        .cd-actions .cd-button { min-height: 34px; padding: 7px 10px; }
        @media (max-width: 760px) {
          .cd-stats { grid-template-columns: 1fr; }
          .cd-card { padding: 14px; }
          .cd-stat-value { margin-top: 6px; }
        }
        @media (max-width: 520px) {
          .cd-form-grid { grid-template-columns: 1fr; }
          .cd-field-full { grid-column: auto; }
          .cd-header { align-items: stretch; }
          .cd-header > .cd-button { width: 100%; }
        }
      `}</style>

      <header className="cd-header">
        <div>
          <h1>{text.title}</h1>
          <p className="cd-muted">{text.description}</p>
        </div>
        <button
          type="button"
          className="cd-button cd-primary"
          onClick={startAdd}
        >
          + {text.add}
        </button>
      </header>

      <section className="cd-stats" aria-label={text.title}>
        <article className="cd-card">
          <div className="cd-stat-label">{text.totalOutstanding}</div>
          <div className="cd-stat-value">
            {formatMoney(totalOutstanding, isArabic)}{" "}
            <small>{text.currency}</small>
          </div>
        </article>

        <article className="cd-card">
          <div className="cd-stat-label">{text.debtors}</div>
          <div className="cd-stat-value">
            {new Set(outstandingRecords.map((record) => record.phone || record.customerName)).size}
          </div>
        </article>

        <article className="cd-card">
          <div className="cd-stat-label">{text.overdueTotal}</div>
          <div className="cd-stat-value">
            {formatMoney(overdueTotal, isArabic)}{" "}
            <small>{text.currency}</small>
          </div>
        </article>
      </section>

      <section className="cd-panel">
        <div className="cd-toolbar">
          <input
            type="search"
            aria-label={text.search}
            placeholder={text.search}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <label className="cd-filter">
            <input
              type="checkbox"
              checked={showOverdueOnly}
              onChange={(event) => setShowOverdueOnly(event.target.checked)}
            />
            {text.overdueFilter}
          </label>

          <button
            type="button"
            className="cd-button"
            onClick={() => {
              setSearch("");
              setShowOverdueOnly(false);
            }}
          >
            {text.allRecords}
          </button>
        </div>

        {notice && (
          <div className="cd-message cd-success" role="status">
            {notice}
          </div>
        )}

        <div className="cd-message cd-notice">
          {text.localNotice}
        </div>

        {formOpen && (
          <form className="cd-form" onSubmit={saveRecord}>
            <h2>{editingId ? text.edit : text.add}</h2>

            <div className="cd-form-grid">
              <label className="cd-field">
                {text.customer}
                <input
                  required
                  autoFocus
                  value={form.customerName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      customerName: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="cd-field">
                {text.phone}
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="cd-field">
                {text.invoice}
                <input
                  value={form.invoiceNumber}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      invoiceNumber: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="cd-field">
                {text.dueDate}
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      dueDate: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="cd-field">
                {text.total}
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={form.totalAmount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      totalAmount: Number(event.target.value),
                    }))
                  }
                />
              </label>

              <label className="cd-field">
                {text.paid}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.paidAmount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      paidAmount: Number(event.target.value),
                    }))
                  }
                />
              </label>

              <label className="cd-field cd-field-full">
                {text.notes}
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            {error && (
              <div className="cd-message cd-error" role="alert">
                {error}
              </div>
            )}

            <div className="cd-form-actions">
              <button
                type="submit"
                className="cd-button cd-primary"
              >
                {text.save}
              </button>
              <button
                type="button"
                className="cd-button"
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                  setError("");
                }}
              >
                {text.cancel}
              </button>
            </div>
          </form>
        )}

        <div className="cd-table-wrap">
          <table className="cd-table">
            <thead>
              <tr>
                <th>{text.customer}</th>
                <th>{text.phone}</th>
                <th>{text.invoice}</th>
                <th>{text.total}</th>
                <th>{text.paid}</th>
                <th>{text.remaining}</th>
                <th>{text.dueDate}</th>
                <th>{text.actions}</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => {
                const remaining =
                  record.totalAmount - record.paidAmount;
                const isOverdue =
                  Boolean(record.dueDate) &&
                  record.dueDate < getToday();

                return (
                  <tr key={record.id}>
                    <td className="cd-customer-name">
                      {record.customerName}
                    </td>
                    <td>{record.phone || "—"}</td>
                    <td>{record.invoiceNumber || "—"}</td>
                    <td>{formatMoney(record.totalAmount, isArabic)}</td>
                    <td>{formatMoney(record.paidAmount, isArabic)}</td>
                    <td className="cd-remaining">
                      {formatMoney(remaining, isArabic)}
                    </td>
                    <td>
                      {record.dueDate || text.noDueDate}
                      {isOverdue && (
                        <div>
                          <span className="cd-status">
                            {text.overdue}
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="cd-actions">
                        <button
                          type="button"
                          className="cd-button"
                          onClick={() => startEdit(record)}
                        >
                          {text.edit}
                        </button>
                        <button
                          type="button"
                          className="cd-button"
                          onClick={() => deleteRecord(record.id)}
                        >
                          {text.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="cd-empty">
                      {outstandingRecords.length === 0
                        ? text.noRecords
                        : text.noResults}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
      }
            
