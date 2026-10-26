import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import type { Language } from "../i18n";
import type { ManagedProduct } from "./ProductManagement";

type Props = {
  language: Language;
  initialProducts?: ManagedProduct[];
  onProductsChange?: (products: ManagedProduct[]) => void;
};

type UnitOption = {
  id: string;
  labelAr: string;
  labelEn: string;
};

type UnitGroup = {
  id: string;
  labelAr: string;
  labelEn: string;
  units: UnitOption[];
};

type MovementType = "in" | "out" | "adjustment";

type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  nextQuantity: number;
  unit: string;
  note: string;
  date: string;
};

type StockNotice = {
  id: string;
  productId: string;
  productName: string;
  quantity: string;
  unit: string;
  type: "low" | "out";
  date: string;
};

const unitGroups: UnitGroup[] = [
  {
    id: "mass",
    labelAr: "الوزن والكتلة",
    labelEn: "Weight and mass",
    units: [
      { id: "microgram", labelAr: "ميكروجرام", labelEn: "Microgram" },
      { id: "milligram", labelAr: "مليجرام", labelEn: "Milligram" },
      { id: "gram", labelAr: "جرام", labelEn: "Gram" },
      { id: "kilogram", labelAr: "كيلوجرام", labelEn: "Kilogram" },
      { id: "tonne", labelAr: "طن متري", labelEn: "Metric tonne" },
    ],
  },
  {
    id: "volume",
    labelAr: "السوائل والحجم",
    labelEn: "Liquids and volume",
    units: [
      { id: "milliliter", labelAr: "مليلتر", labelEn: "Milliliter" },
      { id: "liter", labelAr: "لتر", labelEn: "Liter" },
      { id: "cubic-centimeter", labelAr: "سنتيمتر مكعب", labelEn: "Cubic centimeter" },
      { id: "cubic-meter", labelAr: "متر مكعب", labelEn: "Cubic meter" },
    ],
  },
  {
    id: "count",
    labelAr: "العد والتعبئة والتغليف",
    labelEn: "Counting and packaging",
    units: [
      { id: "piece", labelAr: "قطعة", labelEn: "Piece" },
      { id: "unit", labelAr: "وحدة", labelEn: "Unit" },
      { id: "device", labelAr: "جهاز", labelEn: "Device" },
      { id: "pack", labelAr: "عبوة", labelEn: "Pack" },
      { id: "bag", labelAr: "كيس", labelEn: "Bag" },
      { id: "box", labelAr: "صندوق", labelEn: "Box" },
      { id: "carton", labelAr: "كرتونة", labelEn: "Carton" },
      { id: "bottle", labelAr: "زجاجة", labelEn: "Bottle" },
      { id: "can", labelAr: "علبة", labelEn: "Can" },
      { id: "dozen", labelAr: "دستة", labelEn: "Dozen" },
      { id: "pair", labelAr: "زوج", labelEn: "Pair" },
      { id: "set", labelAr: "طقم", labelEn: "Set" },
      { id: "roll", labelAr: "لفة", labelEn: "Roll" },
      { id: "reel", labelAr: "بكرة", labelEn: "Reel" },
      { id: "pallet", labelAr: "منصة تحميل", labelEn: "Pallet" },
    ],
  },
  {
    id: "length",
    labelAr: "الطول والمسافة",
    labelEn: "Length and distance",
    units: [
      { id: "millimeter", labelAr: "مليمتر", labelEn: "Millimeter" },
      { id: "centimeter", labelAr: "سنتيمتر", labelEn: "Centimeter" },
      { id: "meter", labelAr: "متر", labelEn: "Meter" },
      { id: "kilometer", labelAr: "كيلومتر", labelEn: "Kilometer" },
    ],
  },
  {
    id: "area",
    labelAr: "المساحة",
    labelEn: "Area",
    units: [
      { id: "square-centimeter", labelAr: "سنتيمتر مربع", labelEn: "Square centimeter" },
      { id: "square-meter", labelAr: "متر مربع", labelEn: "Square meter" },
      { id: "hectare", labelAr: "هكتار", labelEn: "Hectare" },
      { id: "feddan", labelAr: "فدان", labelEn: "Feddan" },
    ],
  },
  {
    id: "services",
    labelAr: "الوقت والخدمات",
    labelEn: "Time and services",
    units: [
      { id: "minute", labelAr: "دقيقة", labelEn: "Minute" },
      { id: "hour", labelAr: "ساعة", labelEn: "Hour" },
      { id: "day", labelAr: "يوم", labelEn: "Day" },
      { id: "month", labelAr: "شهر", labelEn: "Month" },
      { id: "session", labelAr: "جلسة", labelEn: "Session" },
      { id: "visit", labelAr: "زيارة", labelEn: "Visit" },
      { id: "task", labelAr: "مهمة", labelEn: "Task" },
      { id: "subscription", labelAr: "اشتراك", labelEn: "Subscription" },
      { id: "license", labelAr: "ترخيص", labelEn: "License" },
      { id: "project", labelAr: "مشروع", labelEn: "Project" },
      { id: "user", labelAr: "مستخدم", labelEn: "User" },
    ],
  },
  {
    id: "digital",
    labelAr: "البيانات الرقمية والتكنولوجيا",
    labelEn: "Digital data and technology",
    units: [
      { id: "byte", labelAr: "بايت", labelEn: "Byte" },
      { id: "kilobyte", labelAr: "كيلوبايت", labelEn: "Kilobyte" },
      { id: "megabyte", labelAr: "ميجابايت", labelEn: "Megabyte" },
      { id: "gigabyte", labelAr: "جيجابايت", labelEn: "Gigabyte" },
      { id: "terabyte", labelAr: "تيرابايت", labelEn: "Terabyte" },
    ],
  },
];

const translations = {
  ar: {
    title: "إدارة المخزون",
    subtitle: "متابعة الكميات والتنبيهات وتسجيل حركات المخزون",
    localNotice: "البيانات محلية حاليًا، ولم تُربط بقاعدة بيانات.",
    search: "ابحث عن صنف بالاسم أو الباركود أو التصنيف...",
    all: "كل الأصناف",
    total: "إجمالي الأصناف",
    low: "مخزون منخفض",
    out: "نفد المخزون",
    available: "متوفر",
    product: "الصنف",
    category: "التصنيف",
    quantity: "الكمية الحالية",
    unit: "وحدة المخزون الأساسية",
    threshold: "حد التنبيه الخاص بالصنف",
    saveThreshold: "حفظ الحد",
    changeUnit: "اختيار وحدة",
    addMovement: "تسجيل حركة مخزون",
    movementType: "نوع الحركة",
    incoming: "وارد",
    outgoing: "منصرف",
    adjustment: "تسوية إلى كمية",
    movementQuantity: "الكمية",
    note: "السبب أو الملاحظة",
    notePlaceholder: "مثال: توريد جديد أو بيع أو جرد",
    saveMovement: "تسجيل الحركة",
    cancel: "إلغاء",
    history: "سجل حركات المخزون",
    noHistory: "لا توجد حركات مسجلة بعد.",
    noProducts: "لا توجد أصناف مطابقة.",
    noProductsYet: "لا توجد أصناف. أضف منتجات من إدارة المنتجات أولًا.",
    lowMessage: "مخزون منخفض",
    outMessage: "نفد المخزون",
    notices: "تنبيهات المخزون",
    noNotices: "لا توجد تنبيهات جديدة.",
    unitSearch: "ابحث عن وحدة قياس...",
    unitGroups: "مجموعات وحدات القياس",
    chooseUnit: "اختيار وحدة القياس",
    customUnit: "وحدة مخصصة",
    customUnitPlaceholder: "اكتب اسم الوحدة",
    addCustomUnit: "إضافة الوحدة",
    choose: "اختيار",
    close: "إغلاق",
    invalidQuantity: "أدخل كمية صحيحة غير سالبة.",
    negativeStock: "لا يمكن أن تصبح كمية المخزون سالبة.",
    required: "اختر الصنف ونوع الحركة وأدخل الكمية.",
    thresholdSaved: "تم تحديث حد التنبيه محليًا.",
    unitSaved: "تم تغيير وحدة الصنف محليًا.",
    adjustmentHint: "أدخل الكمية النهائية التي تريد أن يصبح عليها المخزون.",
    date: "التاريخ",
    type: "نوع الحركة",
    before: "قبل",
    after: "بعد",
    movementAmount: "كمية الحركة",
    currency: "جنيه",
  },
  en: {
    title: "Inventory Management",
    subtitle: "Track stock levels, alerts and inventory movements",
    localNotice: "Data is local to this interface and is not connected to a database.",
    search: "Search by product name, barcode or category...",
    all: "All products",
    total: "Total products",
    low: "Low stock",
    out: "Out of stock",
    available: "Available",
    product: "Product",
    category: "Category",
    quantity: "Current quantity",
    unit: "Base stock unit",
    threshold: "Product alert threshold",
    saveThreshold: "Save threshold",
    changeUnit: "Choose unit",
    addMovement: "Record inventory movement",
    movementType: "Movement type",
    incoming: "Stock in",
    outgoing: "Stock out",
    adjustment: "Adjust to quantity",
    movementQuantity: "Quantity",
    note: "Reason or note",
    notePlaceholder: "Example: delivery, sale or stocktake",
    saveMovement: "Record movement",
    cancel: "Cancel",
    history: "Inventory movement history",
    noHistory: "No movements recorded yet.",
    noProducts: "No matching products.",
    noProductsYet: "No products yet. Add products in Product Management first.",
    lowMessage: "Low stock",
    outMessage: "Out of stock",
    notices: "Inventory alerts",
    noNotices: "No new alerts.",
    unitSearch: "Search measurement units...",
    unitGroups: "Measurement unit groups",
    chooseUnit: "Choose measurement unit",
    customUnit: "Custom unit",
    customUnitPlaceholder: "Enter a unit name",
    addCustomUnit: "Add unit",
    choose: "Select",
    close: "Close",
    invalidQuantity: "Enter a valid non-negative quantity.",
    negativeStock: "Inventory quantity cannot become negative.",
    required: "Select a product and movement type, then enter a quantity.",
    thresholdSaved: "Alert threshold updated locally.",
    unitSaved: "Product unit changed locally.",
    adjustmentHint: "Enter the final quantity you want in stock.",
    date: "Date",
    type: "Movement type",
    before: "Before",
    after: "After",
    movementAmount: "Movement quantity",
    currency: "EGP",
  },
};

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1200,
    width: "100%",
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
  title: { margin: 0, fontSize: 25, fontWeight: 800 },
  subtitle: { margin: "7px 0 0", fontSize: 14, opacity: 0.7 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
    gap: 12,
    marginBottom: 18,
  },
  card: {
    padding: 15,
    border: "1px solid var(--border, #e1e6ee)",
    borderRadius: 12,
    background: "var(--surface, #fff)",
    minWidth: 0,
  },
  panel: {
    padding: 15,
    marginBottom: 18,
    border: "1px solid var(--border, #e1e6ee)",
    borderRadius: 12,
    background: "var(--surface, #fff)",
  },
  input: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: "10px 11px",
    border: "1px solid var(--border, #d5dce6)",
    borderRadius: 8,
    background: "var(--surface, #fff)",
    color: "inherit",
    font: "inherit",
    fontSize: 14,
  },
  label: { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 },
  field: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  button: {
    padding: "10px 13px",
    border: "1px solid #2563eb",
    borderRadius: 8,
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  },
  secondary: {
    padding: "8px 11px",
    border: "1px solid var(--border, #d5dce6)",
    borderRadius: 8,
    background: "var(--surface, #fff)",
    color: "inherit",
    cursor: "pointer",
    fontSize: 13,
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 10,
    marginBottom: 14,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },
  tableWrap: { width: "100%", overflowX: "auto" },
  table: { width: "100%", minWidth: 680, borderCollapse: "collapse", fontSize: 13 },
  th: {
    padding: "11px 9px",
    textAlign: "start",
    borderBottom: "1px solid var(--border, #e1e6ee)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "11px 9px",
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
};

function toNumber(value: string | number | undefined): number {
  if (value === undefined || String(value).trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function makeId(): string {
  return `inventory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getUnitLabel(unit: UnitOption, language: Language): string {
  return language === "ar" ? unit.labelAr : unit.labelEn;
  }
    export default function InventoryManagement({
  language,
  initialProducts = [],
  onProductsChange,
}: Props) {
  const isArabic = language === "ar";
  const t = isArabic ? translations.ar : translations.en;
  const direction = isArabic ? "rtl" : "ltr";

  const [products, setProducts] = useState<ManagedProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [thresholdDrafts, setThresholdDrafts] = useState<Record<string, string>>({});
  const [movementProductId, setMovementProductId] = useState("");
  const [movementType, setMovementType] = useState<MovementType>("in");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [movementNote, setMovementNote] = useState("");
  const [movementError, setMovementError] = useState("");
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [notices, setNotices] = useState<StockNotice[]>([]);
  const [unitProductId, setUnitProductId] = useState<string | null>(null);
  const [unitSearch, setUnitSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("mass");
  const [customUnitName, setCustomUnitName] = useState("");
  const [customUnits, setCustomUnits] = useState<UnitOption[]>([]);
  const [message, setMessage] = useState("");

  const notifiedRef = useRef<Record<string, "low" | "out" | "normal">>({});

  function publishProducts(next: ManagedProduct[]) {
    setProducts(next);
    onProductsChange?.(next);
  }

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const nextNotices: StockNotice[] = [];

    for (const product of products) {
      const quantity = toNumber(product.stockQuantity);
      const threshold = toNumber(product.minimumStock);
      const currentState: "low" | "out" | "normal" =
        quantity <= 0 ? "out" : quantity <= threshold ? "low" : "normal";
      const previousState = notifiedRef.current[product.id];

      if (currentState !== "normal" && currentState !== previousState) {
        nextNotices.push({
          id: makeId(),
          productId: product.id,
          productName: product.name,
          quantity: product.stockQuantity,
          unit: product.unit || "",
          type: currentState,
          date: new Date().toLocaleString(),
        });
      }

      notifiedRef.current[product.id] = currentState;
    }

    if (nextNotices.length > 0) {
      setNotices((previous) => [...nextNotices, ...previous].slice(0, 100));
    }

    const currentIds = new Set(products.map((product) => product.id));
    for (const id of Object.keys(notifiedRef.current)) {
      if (!currentIds.has(id)) delete notifiedRef.current[id];
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return products.filter((product) => {
      if (!query) return true;

      return (
        product.name.toLocaleLowerCase().includes(query) ||
        product.barcode.toLocaleLowerCase().includes(query) ||
        product.category.toLocaleLowerCase().includes(query)
      );
    });
  }, [products, search]);

  const alertCounts = useMemo(() => {
    let low = 0;
    let out = 0;

    for (const product of products) {
      const quantity = toNumber(product.stockQuantity);
      if (quantity <= 0) out += 1;
      else if (quantity <= toNumber(product.minimumStock)) low += 1;
    }

    return { total: products.length, low, out };
  }, [products]);

  const unitLookup = useMemo(() => {
    const allGroups = unitGroups.map((group) => ({
      ...group,
      units: [...group.units],
    }));

    if (customUnits.length > 0) {
      allGroups.push({
        id: "custom",
        labelAr: "وحدات مخصصة",
        labelEn: "Custom units",
        units: customUnits,
      });
    }

    return allGroups;
  }, [customUnits]);

  const filteredUnits = useMemo(() => {
    const query = unitSearch.trim().toLocaleLowerCase();

    return unitLookup
      .map((group) => ({
        ...group,
        units: group.units.filter((unit) => {
          if (!query) return true;
          return (
            unit.labelAr.toLocaleLowerCase().includes(query) ||
            unit.labelEn.toLocaleLowerCase().includes(query) ||
            unit.id.toLocaleLowerCase().includes(query)
          );
        }),
      }))
      .filter((group) => group.units.length > 0);
  }, [unitLookup, unitSearch]);

  function saveThreshold(product: ManagedProduct) {
    const value = thresholdDrafts[product.id] ?? product.minimumStock;

    if (value.trim() === "" || !Number.isFinite(Number(value)) || Number(value) < 0) {
      setMessage(t.invalidQuantity);
      return;
    }

    const next = products.map((item) =>
      item.id === product.id
        ? { ...item, minimumStock: String(value) }
        : item,
    );

    publishProducts(next);
    setMessage(t.thresholdSaved);
  }

  function recordMovement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMovementError("");
    setMessage("");

    if (!movementProductId || movementQuantity.trim() === "") {
      setMovementError(t.required);
      return;
    }

    const amount = Number(movementQuantity);

    if (!Number.isFinite(amount) || amount < 0) {
      setMovementError(t.invalidQuantity);
      return;
    }

    const product = products.find((item) => item.id === movementProductId);

    if (!product) {
      setMovementError(t.required);
      return;
    }

    const previousQuantity = toNumber(product.stockQuantity);
    let nextQuantity = previousQuantity;

    if (movementType === "in") nextQuantity += amount;
    if (movementType === "out") nextQuantity -= amount;
    if (movementType === "adjustment") nextQuantity = amount;

    if (nextQuantity < 0) {
      setMovementError(t.negativeStock);
      return;
    }

    const normalizedQuantity = String(Number(nextQuantity.toFixed(6)));
    const movement: StockMovement = {
      id: makeId(),
      productId: product.id,
      productName: product.name,
      type: movementType,
      quantity: amount,
      previousQuantity,
      nextQuantity,
      unit: product.unit || "",
      note: movementNote.trim(),
      date: new Date().toLocaleString(),
    };

    publishProducts(
      products.map((item) =>
        item.id === product.id
          ? { ...item, stockQuantity: normalizedQuantity }
          : item,
      ),
    );

    setMovements((previous) => [movement, ...previous].slice(0, 500));
    setMovementQuantity("");
    setMovementNote("");
    setMessage("");
  }

  function chooseUnit(unit: UnitOption) {
    if (!unitProductId) return;

    publishProducts(
      products.map((product) =>
        product.id === unitProductId
          ? { ...product, unit: getUnitLabel(unit, language) }
          : product,
      ),
    );

    setUnitProductId(null);
    setUnitSearch("");
    setMessage(t.unitSaved);
  }

  function addCustomUnit() {
    const name = customUnitName.trim();
    if (!name) return;

    const duplicate = customUnits.some(
      (unit) =>
        unit.labelAr.toLocaleLowerCase() === name.toLocaleLowerCase() ||
        unit.labelEn.toLocaleLowerCase() === name.toLocaleLowerCase(),
    );

    if (duplicate) return;

    const unit: UnitOption = {
      id: `custom-${makeId()}`,
      labelAr: name,
      labelEn: name,
    };

    setCustomUnits((previous) => [...previous, unit]);
    setCustomUnitName("");
    setSelectedGroup("custom");
  }

  function getMovementLabel(type: MovementType): string {
    if (type === "in") return t.incoming;
    if (type === "out") return t.outgoing;
    return t.adjustment;
  }

  function getStatus(product: ManagedProduct): "out" | "low" | "available" {
    const quantity = toNumber(product.stockQuantity);
    if (quantity <= 0) return "out";
    if (quantity <= toNumber(product.minimumStock)) return "low";
    return "available";
  }

  function getStatusLabel(product: ManagedProduct): string {
    const status = getStatus(product);
    if (status === "out") return t.out;
    if (status === "low") return t.low;
    return t.available;
  }

  const activeUnitProduct = products.find((product) => product.id === unitProductId);

  return (
    <div style={styles.page} dir={direction}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>{t.title}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>
      </header>

      <section style={styles.grid}>
        <div style={styles.card}>
          <div>{t.total}</div>
          <strong style={{ display: "block", fontSize: 25, marginTop: 8 }}>
            {alertCounts.total}
          </strong>
        </div>
        <div style={styles.card}>
          <div>{t.low}</div>
          <strong style={{ display: "block", fontSize: 25, marginTop: 8, color: "#b45309" }}>
            {alertCounts.low}
          </strong>
        </div>
        <div style={styles.card}>
          <div>{t.out}</div>
          <strong style={{ display: "block", fontSize: 25, marginTop: 8, color: "#dc2626" }}>
            {alertCounts.out}
          </strong>
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={{ margin: "0 0 13px", fontSize: 18 }}>{t.notices}</h2>

        {notices.length === 0 ? (
          <p style={{ opacity: 0.7 }}>{t.noNotices}</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {notices.map((notice) => (
              <div
                key={notice.id}
                style={{
                  border: "1px solid var(--border, #e1e6ee)",
                  borderInlineStart: `4px solid ${notice.type === "out" ? "#dc2626" : "#d97706"}`,
                  borderRadius: 8,
                  padding: 11,
                }}
              >
                <strong>{notice.type === "out" ? t.outMessage : t.lowMessage}</strong>
                {" — "}
                {notice.productName}
                {" · "}
                {notice.quantity}
                {notice.unit ? ` ${notice.unit}` : ""}
                <div style={{ fontSize: 11, opacity: 0.65, marginTop: 4 }}>
                  {notice.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={styles.panel}>
        <div style={styles.filters}>
          <input
            style={styles.input}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p style={{ padding: 20, textAlign: "center", opacity: 0.7 }}>
            {products.length === 0 ? t.noProductsYet : t.noProducts}
          </p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{t.product}</th>
                  <th style={styles.th}>{t.category}</th>
                  <th style={styles.th}>{t.quantity}</th>
                  <th style={styles.th}>{t.unit}</th>
                  <th style={styles.th}>{t.threshold}</th>
                  <th style={styles.th}>{t.changeUnit}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStatus(product);
                  const statusColor =
                    status === "out"
                      ? { background: "#fee2e2", color: "#b91c1c" }
                      : status === "low"
                        ? { background: "#fef3c7", color: "#92400e" }
                        : { background: "#dcfce7", color: "#166534" };

                  return (
                    <tr key={product.id}>
                      <td style={styles.td}>
                        <strong>{product.name}</strong>
                        {product.barcode && (
                          <div style={{ fontSize: 11, opacity: 0.65, marginTop: 4 }}>
                            {product.barcode}
                          </div>
                        )}
                        <div style={{ marginTop: 6 }}>
                          <span style={{ ...styles.badge, ...statusColor }}>
                            {getStatusLabel(product)}
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>{product.category || "—"}</td>
                      <td style={styles.td}>
                        <strong>{product.stockQuantity || "0"}</strong>
                        {product.unit ? ` ${product.unit}` : ""}
                      </td>
                      <td style={styles.td}>{product.unit || "—"}</td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 6, minWidth: 155 }}>
                          <input
                            style={{ ...styles.input, maxWidth: 100 }}
                            type="number"
                            min="0"
                            step="any"
                            value={
                              thresholdDrafts[product.id] ??
                              product.minimumStock
                            }
                            onChange={(event) =>
                              setThresholdDrafts((previous) => ({
                                ...previous,
                                [product.id]: event.target.value,
                              }))
                            }
                            aria-label={`${t.threshold}: ${product.name}`}
                          />
                          <button
                            type="button"
                            style={styles.secondary}
                            onClick={() => saveThreshold(product)}
                          >
                            {t.saveThreshold}
                          </button>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <button
                          type="button"
                          style={styles.secondary}
                          onClick={() => {
                            setUnitProductId(product.id);
                            setUnitSearch("");
                            setSelectedGroup("mass");
                          }}
                        >
                          {t.changeUnit}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
            <section style={styles.panel}>
        <h2 style={{ margin: "0 0 15px", fontSize: 18 }}>{t.addMovement}</h2>

        <form onSubmit={recordMovement}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>{t.product}</label>
              <select
                style={styles.input}
                value={movementProductId}
                onChange={(event) => setMovementProductId(event.target.value)}
                required
              >
                <option value="">{t.all}</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>{t.movementType}</label>
              <select
                style={styles.input}
                value={movementType}
                onChange={(event) =>
                  setMovementType(event.target.value as MovementType)
                }
              >
                <option value="in">{t.incoming}</option>
                <option value="out">{t.outgoing}</option>
                <option value="adjustment">{t.adjustment}</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>{t.movementQuantity}</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                step="any"
                value={movementQuantity}
                onChange={(event) => setMovementQuantity(event.target.value)}
                required
              />
              {movementType === "adjustment" && (
                <small style={{ opacity: 0.7 }}>{t.adjustmentHint}</small>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>{t.note}</label>
              <input
                style={styles.input}
                value={movementNote}
                onChange={(event) => setMovementNote(event.target.value)}
                placeholder={t.notePlaceholder}
                maxLength={300}
              />
            </div>
          </div>

          {movementError && (
            <p role="alert" style={{ color: "#dc2626", fontWeight: 600 }}>
              {movementError}
            </p>
          )}

          <button
            type="submit"
            style={{ ...styles.button, marginTop: 14 }}
            disabled={products.length === 0}
          >
            {t.saveMovement}
          </button>
        </form>
      </section>

      <section style={styles.panel}>
        <h2 style={{ margin: "0 0 15px", fontSize: 18 }}>{t.history}</h2>

        {movements.length === 0 ? (
          <p style={{ opacity: 0.7 }}>{t.noHistory}</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>{t.date}</th>
                  <th style={styles.th}>{t.product}</th>
                  <th style={styles.th}>{t.type}</th>
                  <th style={styles.th}>{t.movementAmount}</th>
                  <th style={styles.th}>{t.before}</th>
                  <th style={styles.th}>{t.after}</th>
                  <th style={styles.th}>{t.note}</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td style={styles.td}>{movement.date}</td>
                    <td style={styles.td}>{movement.productName}</td>
                    <td style={styles.td}>{getMovementLabel(movement.type)}</td>
                    <td style={styles.td}>
                      {movement.quantity}
                      {movement.unit ? ` ${movement.unit}` : ""}
                    </td>
                    <td style={styles.td}>{movement.previousQuantity}</td>
                    <td style={styles.td}>{movement.nextQuantity}</td>
                    <td style={styles.td}>{movement.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

      {unitProductId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.chooseUnit}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.58)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 14,
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setUnitProductId(null);
            }
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 680,
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: 14,
              padding: 18,
              boxSizing: "border-box",
              background: "var(--surface, #fff)",
              color: "var(--text-primary, #172033)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>{t.chooseUnit}</h2>
                {activeUnitProduct && (
                  <p style={{ margin: "6px 0 0", opacity: 0.7, fontSize: 13 }}>
                    {activeUnitProduct.name}
                  </p>
                )}
              </div>
              <button
                type="button"
                style={styles.secondary}
                onClick={() => setUnitProductId(null)}
              >
                {t.close}
              </button>
            </div>

            <input
              style={styles.input}
              value={unitSearch}
              onChange={(event) => setUnitSearch(event.target.value)}
              placeholder={t.unitSearch}
              aria-label={t.unitSearch}
              autoFocus
            />

            <div style={{ marginTop: 15 }}>
              <h3 style={{ fontSize: 15, margin: "0 0 10px" }}>
                {t.unitGroups}
              </h3>

              {filteredUnits.length === 0 ? (
                <p style={{ opacity: 0.7 }}>{t.noProducts}</p>
              ) : (
                <div style={{ display: "grid", gap: 13 }}>
                  {filteredUnits.map((group) => (
                    <div
                      key={group.id}
                      style={{
                        border: "1px solid var(--border, #e1e6ee)",
                        borderRadius: 10,
                        padding: 11,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedGroup(group.id)}
                        style={{
                          border: 0,
                          padding: 0,
                          marginBottom: 10,
                          background: "transparent",
                          color: "inherit",
                          font: "inherit",
                          fontWeight: 800,
                          cursor: "pointer",
                          textAlign: "start",
                        }}
                      >
                        {isArabic ? group.labelAr : group.labelEn}
                        {selectedGroup === group.id ? " ✓" : ""}
                      </button>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))",
                          gap: 7,
                        }}
                      >
                        {group.units.map((unit) => (
                          <button
                            key={unit.id}
                            type="button"
                            style={styles.secondary}
                            onClick={() => chooseUnit(unit)}
                          >
                            {getUnitLabel(unit, language)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border, #e1e6ee)",
                marginTop: 18,
                paddingTop: 15,
              }}
            >
              <label style={styles.label}>{t.customUnit}</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  gap: 8,
                }}
              >
                <input
                  style={styles.input}
                  value={customUnitName}
                  onChange={(event) => setCustomUnitName(event.target.value)}
                  placeholder={t.customUnitPlaceholder}
                  maxLength={50}
                />
                <button
                  type="button"
                  style={styles.button}
                  onClick={addCustomUnit}
                  disabled={!customUnitName.trim()}
                >
                  {t.addCustomUnit}
                </button>
              </div>

              {customUnits.length > 0 && (
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
                  {isArabic
                    ? `عدد الوحدات المخصصة: ${customUnits.length}`
                    : `Custom units: ${customUnits.length}`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
              }
