import { useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import type { Language } from "../i18n";

type DiscountType = "none" | "percent" | "fixed";
type ProductStatus = "active" | "inactive";

export type ManagedProduct = {
  id: string;
  name: string;
  barcode: string;
  category: string;
  description: string;
  purchasePrice: string;
  originalPrice: string;
  discountType: DiscountType;
  discountValue: string;
  stockQuantity: string;
  minimumStock: string;
  unit: string;
  status: ProductStatus;
};

type ProductForm = Omit<ManagedProduct, "id">;

type Props = {
  language: Language;
  initialProducts?: ManagedProduct[];
  onProductsChange?: (products: ManagedProduct[]) => void;
};

const emptyProduct: ProductForm = {
  name: "",
  barcode: "",
  category: "",
  description: "",
  purchasePrice: "",
  originalPrice: "",
  discountType: "none",
  discountValue: "",
  stockQuantity: "",
  minimumStock: "5",
  unit: "",
  status: "active",
};

const translations = {
  ar: {
    title: "إدارة المنتجات",
    subtitle: "إضافة المنتجات وتنظيم الأسعار والمخزون",
    add: "إضافة منتج",
    edit: "تعديل المنتج",
    search: "ابحث باسم المنتج أو الباركود أو التصنيف...",
    all: "كل المنتجات",
    active: "نشط",
    inactive: "غير نشط",
    total: "إجمالي المنتجات",
    low: "مخزون منخفض",
    out: "نفد المخزون",
    value: "قيمة المخزون بسعر التكلفة",
    name: "اسم المنتج",
    barcode: "الباركود",
    category: "التصنيف",
    description: "وصف المنتج",
    purchase: "سعر الشراء",
    price: "سعر البيع قبل الخصم",
    discountType: "نوع الخصم",
    noDiscount: "بدون خصم",
    percent: "نسبة مئوية %",
    fixed: "مبلغ ثابت",
    discountValue: "قيمة الخصم",
    stock: "الكمية المتاحة",
    minimum: "حد التنبيه للمخزون",
    unit: "وحدة القياس",
    status: "حالة المنتج",
    save: "حفظ المنتج",
    cancel: "إلغاء",
    delete: "حذف",
    searchEmpty: "لا توجد منتجات مطابقة",
    empty: "لم تتم إضافة منتجات بعد",
    confirmDelete: "هل تريد حذف هذا المنتج؟",
    duplicate: "هذا الباركود مسجل لمنتج آخر بالفعل.",
    required: "يرجى إدخال اسم المنتج وسعر البيع والكمية.",
    invalidPrice: "الأسعار والكميات يجب أن تكون أرقامًا صحيحة أو عشرية غير سالبة.",
    finalPrice: "السعر بعد الخصم",
    profit: "الربح المتوقع للوحدة",
    lowLabel: "مخزون منخفض",
    outLabel: "نفد المخزون",
    available: "متوفر",
    actions: "الإجراءات",
    allCategories: "كل التصنيفات",
    count: "عدد المنتجات",
    localNotice: "البيانات محلية داخل الواجهة حاليًا، ولم تُربط بقاعدة بيانات.",
    unitPlaceholder: "قطعة، كيلو، لتر...",
    categoryPlaceholder: "مثال: مشروبات",
    descriptionPlaceholder: "تفاصيل اختيارية عن المنتج",
    barcodePlaceholder: "أدخل الباركود",
    noCategory: "بدون تصنيف",
    currency: "جنيه",
    filterStatus: "تصفية حسب الحالة",
    filterCategory: "تصفية حسب التصنيف",
  },
  en: {
    title: "Product Management",
    subtitle: "Manage products, prices and inventory",
    add: "Add product",
    edit: "Edit product",
    search: "Search by name, barcode or category...",
    all: "All products",
    active: "Active",
    inactive: "Inactive",
    total: "Total products",
    low: "Low stock",
    out: "Out of stock",
    value: "Inventory cost value",
    name: "Product name",
    barcode: "Barcode",
    category: "Category",
    description: "Product description",
    purchase: "Purchase price",
    price: "Selling price before discount",
    discountType: "Discount type",
    noDiscount: "No discount",
    percent: "Percentage %",
    fixed: "Fixed amount",
    discountValue: "Discount value",
    stock: "Available quantity",
    minimum: "Low-stock alert threshold",
    unit: "Unit of measure",
    status: "Product status",
    save: "Save product",
    cancel: "Cancel",
    delete: "Delete",
    searchEmpty: "No matching products",
    empty: "No products have been added yet",
    confirmDelete: "Delete this product?",
    duplicate: "This barcode is already assigned to another product.",
    required: "Enter a product name, selling price and quantity.",
    invalidPrice: "Prices and quantities must be non-negative numbers.",
    finalPrice: "Price after discount",
    profit: "Expected profit per unit",
    lowLabel: "Low stock",
    outLabel: "Out of stock",
    available: "In stock",
    actions: "Actions",
    allCategories: "All categories",
    count: "Product count",
    localNotice: "Data is currently local to this interface and is not connected to a database.",
    unitPlaceholder: "Piece, kg, liter...",
    categoryPlaceholder: "Example: Drinks",
    descriptionPlaceholder: "Optional product details",
    barcodePlaceholder: "Enter barcode",
    noCategory: "Uncategorized",
    currency: "EGP",
    filterStatus: "Filter by status",
    filterCategory: "Filter by category",
  },
};

const styles: Record<string, CSSProperties> = {
  page: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: 16,
    boxSizing: "border-box",
    color: "var(--text-primary, #172033)",
    fontFamily: "inherit",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  title: { fontSize: 25, fontWeight: 800, margin: 0 },
  subtitle: { margin: "7px 0 0", opacity: 0.7, fontSize: 14 },
  button: {
    border: "1px solid #2563eb",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 9,
    padding: "10px 15px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid var(--border, #dbe1ea)",
    background: "var(--surface, #fff)",
    color: "inherit",
    borderRadius: 8,
    padding: "8px 11px",
    cursor: "pointer",
    fontSize: 13,
  },
  input: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    border: "1px solid var(--border, #d5dce6)",
    borderRadius: 8,
    padding: "10px 11px",
    background: "var(--surface, #fff)",
    color: "inherit",
    font: "inherit",
    fontSize: 14,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
  },
  field: { minWidth: 0, display: "flex", flexDirection: "column", gap: 2 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
    gap: 12,
    marginBottom: 20,
  },
  stat: {
    padding: 15,
    border: "1px solid var(--border, #e1e6ee)",
    borderRadius: 12,
    background: "var(--surface, #fff)",
    minWidth: 0,
  },
  statLabel: { fontSize: 12, opacity: 0.7, marginBottom: 8 },
  statValue: { fontSize: 23, fontWeight: 800 },
  panel: {
    border: "1px solid var(--border, #e1e6ee)",
    borderRadius: 12,
    background: "var(--surface, #fff)",
    padding: 15,
    marginBottom: 18,
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
    marginBottom: 14,
  },
  tableWrap: { width: "100%", overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
    minWidth: 750,
  },
  th: {
    padding: "12px 10px",
    textAlign: "start",
    borderBottom: "1px solid var(--border, #e1e6ee)",
    opacity: 0.7,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 10px",
    textAlign: "start",
    borderBottom: "1px solid var(--border, #edf0f5)",
    verticalAlign: "middle",
  },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 13,
  },
};

function numberValue(value: string): number {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: number, currency: string): string {
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function getFinalPrice(product: ProductForm | ManagedProduct): number {
  const price = numberValue(product.originalPrice);
  const discount = numberValue(product.discountValue);

  if (product.discountType === "percent") {
    return Math.max(0, price - (price * Math.min(100, discount)) / 100);
  }

  if (product.discountType === "fixed") {
    return Math.max(0, price - discount);
  }

  return price;
}

function stockState(product: ManagedProduct): "out" | "low" | "available" {
  const quantity = numberValue(product.stockQuantity);
  if (quantity <= 0) return "out";

  const minimum = numberValue(product.minimumStock);
  if (quantity <= minimum) return "low";

  return "available";
}

function makeId(): string {
  return `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ProductManagement({
  language,
  initialProducts = [],
  onProductsChange,
}: Props) {
  const isArabic = language === "ar";
  const t = isArabic ? translations.ar : translations.en;

  const [products, setProducts] = useState<ManagedProduct[]>(initialProducts);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");

  const direction = isArabic ? "rtl" : "ltr";

  function publishProducts(next: ManagedProduct[]) {
    setProducts(next);
    onProductsChange?.(next);
  }

  function updateField<K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyProduct });
    setError("");
    setFormOpen(true);
  }

  function openEditForm(product: ManagedProduct) {
    const { id: _id, ...productFields } = product;
    setEditingId(product.id);
    setForm({ ...productFields });
    setError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyProduct });
    setError("");
  }

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.category.trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLocaleLowerCase().includes(query) ||
        product.barcode.toLocaleLowerCase().includes(query) ||
        product.category.toLocaleLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, search, statusFilter, categoryFilter]);

  const statistics = useMemo(() => {
    const lowStock = products.filter(
      (product) => stockState(product) === "low",
    ).length;

    const outOfStock = products.filter(
      (product) => stockState(product) === "out",
    ).length;

    const inventoryValue = products.reduce(
      (sum, product) =>
        sum +
        numberValue(product.purchasePrice) *
          numberValue(product.stockQuantity),
      0,
    );

    return {
      total: products.length,
      lowStock,
      outOfStock,
      inventoryValue,
    };
  }, [products]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      form.originalPrice.trim() === "" ||
      form.stockQuantity.trim() === ""
    ) {
      setError(t.required);
      return;
    }

    const numericFields = [
      form.purchasePrice,
      form.originalPrice,
      form.discountValue,
      form.stockQuantity,
      form.minimumStock,
    ];

    if (
      numericFields.some(
        (value) => value.trim() !== "" &&
          (!Number.isFinite(Number(value)) || Number(value) < 0),
      )
    ) {
      setError(t.invalidPrice);
      return;
    }

    if (
      form.discountType === "percent" &&
      numberValue(form.discountValue) > 100
    ) {
      setError(t.invalidPrice);
      return;
    }

    const duplicateBarcode =
      form.barcode.trim() !== "" &&
      products.some(
        (product) =>
          product.barcode.trim() === form.barcode.trim() &&
          product.id !== editingId,
      );

    if (duplicateBarcode) {
      setError(t.duplicate);
      return;
    }

    const normalized: ProductForm = {
      ...form,
      name: form.name.trim(),
      barcode: form.barcode.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      unit: form.unit.trim(),
      minimumStock: form.minimumStock.trim() || "5",
      discountValue: form.discountType === "none" ? "" : form.discountValue,
    };

    if (editingId) {
      publishProducts(
        products.map((product) =>
          product.id === editingId
            ? { ...normalized, id: editingId }
            : product,
        ),
      );
    } else {
      publishProducts([...products, { ...normalized, id: makeId() }]);
    }

    closeForm();
}
  
  return (
    <div style={styles.page} dir={direction}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>

        <button type="button" style={styles.button} onClick={openAddForm}>
          + {t.add}
        </button>
      </header>

      <section style={styles.grid}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>{t.total}</div>
          <div style={styles.statValue}>{statistics.total}</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statLabel}>{t.low}</div>
          <div style={styles.statValue}>{statistics.lowStock}</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statLabel}>{t.out}</div>
          <div style={styles.statValue}>{statistics.outOfStock}</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statLabel}>{t.value}</div>
          <div style={{ ...styles.statValue, fontSize: 18 }}>
            {money(statistics.inventoryValue, t.currency)}
          </div>
        </div>
      </section>

      {formOpen && (
        <section style={styles.panel}>
          <h2 style={{ fontSize: 19, margin: "0 0 16px" }}>
            {editingId ? t.edit : t.add}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>{t.name} *</label>
                <input
                  style={styles.input}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                  maxLength={150}
                  autoFocus
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{t.barcode}</label>
                <input
                  style={styles.input}
                  value={form.barcode}
                  onChange={(event) =>
                    updateField("barcode", event.target.value)
                  }
                  placeholder={t.barcodePlaceholder}
                  maxLength={100}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{t.category}</label>
                <input
                  style={styles.input}
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  placeholder={t.categoryPlaceholder}
                  maxLength={100}
                  list="product-category-options"
                />
                <datalist id="product-category-options">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{t.unit}</label>
                <input
                  style={styles.input}
                  value={form.unit}
                  onChange={(event) => updateField("unit", event.target.value)}
                  placeholder={t.unitPlaceholder}
                  maxLength={40}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{t.purchase}</label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="any"
                  value={form.purchasePrice}
                  onChange={(event) =>
                    updateField("purchasePrice", event.target.value)
                  }
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{t.price} *</label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="any"
                  value={form.originalPrice}
                  onChange={(event) =>
                    updateField("originalPrice", event.target.value)
                  }
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{t.discountType}</label>
                <select
                  style={styles.input}
                  value={form.discountType}
                  onChange={(event) =>
                    updateField(
                      "discountType",
                      event.target.value as DiscountType,
                    )
                  }
                >
                  <option value="none">{t.noDiscount}</option>
                  <option value="percent">{t.percent}</option>
                  <option value="fixed">{t.fixed}</option>
                </select>
              </div>

              {form.discountType !== "none" && (
                <div style={styles.field}>
                  <label style={styles.label}>{t.discountValue}</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    max={form.discountType === "percent" ? 100 : undefined}
                    step="any"
                    value={form.discountValue}
                    onChange={(event) =>
                      updateField("discountValue", event.target.value)
                    }
                  />
                </div>
              )}

              <div style={styles.field}>
                <label style={styles.label}>{t.stock} *</label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="any"
                  value={form.stockQuantity}
                  onChange={(event) =>
                    updateField("stockQuantity", event.target.value)
                  }
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{t.minimum}</label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="any"
                  value={form.minimumStock}
                  onChange={(event) =>
                    updateField("minimumStock", event.target.value)
                  }
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>{t.status}</label>
                <select
                  style={styles.input}
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as ProductStatus)
                  }
                >
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                </select>
              </div>

              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>{t.description}</label>
                <textarea
                  style={{ ...styles.input, resize: "vertical" }}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder={t.descriptionPlaceholder}
                  rows={3}
                  maxLength={1000}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: 15,
                padding: 13,
                borderRadius: 9,
                background: "var(--muted-surface, #f3f6fb)",
                display: "flex",
                flexWrap: "wrap",
                gap: 18,
              }}
            >
              <div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {t.finalPrice}
                </div>
                <strong>
                  {money(getFinalPrice(form), t.currency)}
                </strong>
              </div>

              <div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {t.profit}
                </div>
                <strong>
                  {money(
                    getFinalPrice(form) - numberValue(form.purchasePrice),
                    t.currency,
                  )}
                </strong>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                style={{
                  color: "#dc2626",
                  fontSize: 13,
                  fontWeight: 600,
                  margin: "12px 0 0",
                }}
              >
                {error}
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 9,
                marginTop: 16,
              }}
            >
              <button type="submit" style={styles.button}>
                {t.save}
              </button>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={closeForm}
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </section>
      )}

      <section style={styles.panel}>
        <div style={styles.filters}>
          <input
            style={styles.input}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />

          <select
            style={styles.input}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label={t.filterStatus}
          >
            <option value="all">{t.all}</option>
            <option value="active">{t.active}</option>
            <option value="inactive">{t.inactive}</option>
          </select>

          <select
            style={styles.input}
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label={t.filterCategory}
          >
            <option value="all">{t.allCategories}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ padding: "35px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📦</div>
            <div style={{ fontWeight: 700 }}>
              {products.length === 0 ? t.empty : t.searchEmpty}
            </div>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{t.name}</th>
                  <th style={styles.th}>{t.barcode}</th>
                  <th style={styles.th}>{t.category}</th>
                  <th style={styles.th}>{t.price}</th>
                  <th style={styles.th}>{t.finalPrice}</th>
                  <th style={styles.th}>{t.stock}</th>
                  <th style={styles.th}>{t.status}</th>
                  <th style={styles.th}>{t.actions}</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const inventoryState = stockState(product);
                  const finalPrice = getFinalPrice(product);

                  const stateText =
                    inventoryState === "out"
                      ? t.outLabel
                      : inventoryState === "low"
                        ? t.lowLabel
                        : t.available;

                  const stateColor =
                    inventoryState === "out"
                      ? { background: "#fee2e2", color: "#b91c1c" }
                      : inventoryState === "low"
                        ? { background: "#fef3c7", color: "#92400e" }
                        : { background: "#dcfce7", color: "#166534" };

                  return (
                    <tr key={product.id}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 700 }}>{product.name}</div>
                        {product.description && (
                          <div
                            style={{
                              fontSize: 11,
                              opacity: 0.65,
                              marginTop: 4,
                              maxWidth: 190,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {product.description}
                          </div>
                        )}
                      </td>

                      <td style={styles.td}>
                        {product.barcode || "—"}
                      </td>

                      <td style={styles.td}>
                        {product.category || t.noCategory}
                      </td>

                      <td style={styles.td}>
                        {money(numberValue(product.originalPrice), t.currency)}
                      </td>

                      <td style={styles.td}>
                        <strong>{money(finalPrice, t.currency)}</strong>
                        {product.discountType !== "none" && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#15803d",
                              marginTop: 3,
                            }}
                          >
                            {isArabic ? "بعد الخصم" : "Discounted"}
                          </div>
                        )}
                      </td>

                      <td style={styles.td}>
                        {product.stockQuantity}
                        {product.unit ? ` ${product.unit}` : ""}
                        <div style={{ marginTop: 5 }}>
                          <span
                            style={{
                              ...styles.badge,
                              ...stateColor,
                            }}
                          >
                            {stateText}
                          </span>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            background:
                              product.status === "active"
                                ? "#dbeafe"
                                : "#e5e7eb",
                            color:
                              product.status === "active"
                                ? "#1d4ed8"
                                : "#4b5563",
                          }}
                        >
                          {product.status === "active" ? t.active : t.inactive}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            style={styles.secondaryButton}
                            onClick={() => openEditForm(product)}
                          >
                            {isArabic ? "تعديل" : "Edit"}
                          </button>

                          <button
                            type="button"
                            style={{
                              ...styles.secondaryButton,
                              color: "#dc2626",
                              borderColor: "#fecaca",
                            }}
                            onClick={() => {
                              if (window.confirm(t.confirmDelete)) {
                                publishProducts(
                                  products.filter(
                                    (item) => item.id !== product.id,
                                  ),
                                );
                              }
                            }}
                          >
                            {t.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div
          style={{
            marginTop: 13,
            fontSize: 12,
            opacity: 0.65,
            textAlign: "end",
          }}
        >
          {t.count}: {filteredProducts.length}
        </div>
      </section>

      <p
        style={{
          fontSize: 12,
          opacity: 0.65,
          textAlign: "center",
          margin: "15px 0",
        }}
      >
        {t.localNotice}
      </p>
    </div>
  );
    }
                                     
