import { useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import type { Language } from "../i18n";

export type CashierProduct = {
  id: string;
  nameAr: string;
  nameEn: string;
  barcode: string;
  price: number;
  stock: number;
  category?: string;
};

type CartItem = {
  product: CashierProduct;
  quantity: number;
  discount: number;
};

type CashierPOSProps = {
  language: Language;
  products?: CashierProduct[];
  onCompleteSale?: (
    items: CartItem[],
    paymentMethod: "cash" | "card" | "other",
    total: number
  ) => void;
};

type PaymentMethod = "cash" | "card" | "other";

const translations = {
  ar: {
    title: "نقطة البيع",
    subtitle: "واجهة الكاشير",
    products: "المنتجات",
    cart: "سلة البيع",
    search: "ابحث باسم المنتج أو الباركود",
    all: "كل المنتجات",
    add: "إضافة للسلة",
    emptyProducts: "لا توجد منتجات متاحة للعرض حاليًا",
    emptyProductsHint: "ستظهر المنتجات بعد ربط شاشة الكاشير ببيانات المخزون.",
    emptyCart: "السلة فارغة",
    emptyCartHint: "اختر منتجًا من قائمة المنتجات لإضافته إلى السلة.",
    quantity: "الكمية",
    increase: "زيادة الكمية",
    decrease: "تقليل الكمية",
    remove: "حذف",
    subtotal: "الإجمالي قبل الخصم",
    discount: "الخصم",
    total: "الإجمالي النهائي",
    clear: "إفراغ السلة",
    barcode: "إدخال الباركود",
    barcodePlaceholder: "امسح أو اكتب الباركود",
    addBarcode: "إضافة",
    unknownBarcode: "لا يوجد منتج مطابق لهذا الباركود ضمن المنتجات المتاحة.",
    invalidBarcode: "أدخل باركودًا صحيحًا.",
    outOfStock: "الكمية المطلوبة غير متاحة في المخزون.",
    payment: "إتمام البيع",
    paymentTitle: "طريقة الدفع",
    cash: "نقدًا",
    card: "بطاقة",
    other: "طريقة أخرى",
    confirm: "تأكيد البيع",
    cancel: "إلغاء",
    noProducts: "لا يمكن إتمام البيع لأن السلة فارغة.",
    invalidDiscount: "الخصم يجب أن يكون بين صفر و10%.",
    saleNotice:
      "إتمام البيع الفعلي وحفظ الفاتورة وتحديث المخزون يتطلب ربط الخادم وقاعدة البيانات.",
    camera: "مسح الباركود بالكاميرا",
    cameraNotice:
      "مسح الباركود بالكاميرا غير مفعّل بعد، ولن يتم الادعاء بأنه يعمل قبل تنفيذه.",
    close: "إغلاق",
    available: "المتاح",
    price: "السعر",
    category: "التصنيف",
    discountPercent: "نسبة الخصم %",
    saleUnavailable:
      "لم يتم ربط عملية البيع بالخادم بعد؛ لم يتم تسجيل فاتورة أو خصم مخزون.",
  },
  en: {
    title: "Point of Sale",
    subtitle: "Cashier workspace",
    products: "Products",
    cart: "Sales cart",
    search: "Search by product name or barcode",
    all: "All products",
    add: "Add to cart",
    emptyProducts: "No products are available to display",
    emptyProductsHint:
      "Products will appear after connecting the cashier screen to inventory data.",
    emptyCart: "The cart is empty",
    emptyCartHint: "Select a product to add it to the cart.",
    quantity: "Quantity",
    increase: "Increase quantity",
    decrease: "Decrease quantity",
    remove: "Remove",
    subtotal: "Subtotal before discount",
    discount: "Discount",
    total: "Final total",
    clear: "Clear cart",
    barcode: "Enter barcode",
    barcodePlaceholder: "Scan or type a barcode",
    addBarcode: "Add",
    unknownBarcode: "No matching product was found in the available product list.",
    invalidBarcode: "Enter a valid barcode.",
    outOfStock: "The requested quantity is not available in stock.",
    payment: "Checkout",
    paymentTitle: "Payment method",
    cash: "Cash",
    card: "Card",
    other: "Other",
    confirm: "Confirm sale",
    cancel: "Cancel",
    noProducts: "Cannot complete a sale with an empty cart.",
    invalidDiscount: "Discount must be between 0 and 10%.",
    saleNotice:
      "Actual checkout, invoice storage, and inventory updates require a connected backend and database.",
    camera: "Scan barcode with camera",
    cameraNotice:
      "Camera barcode scanning is not implemented yet.",
    close: "Close",
    available: "Available",
    price: "Price",
    category: "Category",
    discountPercent: "Discount percentage %",
    saleUnavailable:
      "Checkout is not connected to the backend. No invoice was recorded and no stock was deducted.",
  },
};

export default function CashierPOS({
  language,
  products = [],
  onCompleteSale,
}: CashierPOSProps) {
  const isArabic = language === "ar";
  const t = translations[language];

  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCameraNotice, setShowCameraNotice] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");
  const [message, setMessage] = useState("");

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      padding: 20,
      background: "#f5f7fb",
      color: "#172033",
      fontFamily: "system-ui, sans-serif",
      direction: isArabic ? "rtl" : "ltr",
      boxSizing: "border-box",
    },
    header: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 20,
    },
    title: {
      margin: 0,
      fontSize: 26,
      fontWeight: 800,
    },
    subtitle: {
      marginTop: 6,
      color: "#64748b",
      fontSize: 14,
    },
    button: {
      padding: "11px 15px",
      border: "1px solid #dbe2ea",
      borderRadius: 10,
      background: "#ffffff",
      color: "#172033",
      fontSize: 14,
      fontWeight: 650,
      cursor: "pointer",
    },
    primaryButton: {
      padding: "12px 16px",
      border: "none",
      borderRadius: 10,
      background: "#2457d6",
      color: "#ffffff",
      fontSize: 14,
      fontWeight: 750,
      cursor: "pointer",
    },
    input: {
      width: "100%",
      minWidth: 0,
      padding: 12,
      border: "1px solid #dbe2ea",
      borderRadius: 10,
      background: "#ffffff",
      color: "#172033",
      fontSize: 14,
      boxSizing: "border-box",
    },
    layout: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
      gap: 18,
      alignItems: "start",
    },
    panel: {
      minWidth: 0,
      padding: 18,
      border: "1px solid #e3e8f0",
      borderRadius: 16,
      background: "#ffffff",
      boxSizing: "border-box",
    },
    sectionTitle: {
      margin: "0 0 15px",
      fontSize: 19,
      fontWeight: 800,
    },
    empty: {
      padding: "32px 12px",
      textAlign: "center",
      color: "#64748b",
      lineHeight: 1.8,
    },
    muted: {
      color: "#64748b",
      fontSize: 13,
      lineHeight: 1.7,
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    separator: {
      border: 0,
      borderTop: "1px solid #e8edf3",
      margin: "16px 0",
    },
    message: {
      padding: 12,
      borderRadius: 10,
      background: "#fff7e6",
      color: "#7a4b00",
      fontSize: 13,
      lineHeight: 1.7,
      marginTop: 12,
    },
    overlay: {
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "rgba(15, 23, 42, 0.55)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      boxSizing: "border-box",
    },
    dialog: {
      width: "100%",
      maxWidth: 420,
      maxHeight: "90vh",
      overflowY: "auto",
      padding: 22,
      borderRadius: 16,
      background: "#ffffff",
      color: "#172033",
      boxSizing: "border-box",
    },
  };

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase(
      isArabic ? "ar" : "en"
    );

    if (!term) return products;

    return products.filter((product) => {
      const name = isArabic ? product.nameAr : product.nameEn;

      return (
        name.toLocaleLowerCase(isArabic ? "ar" : "en").includes(term) ||
        product.nameAr.toLocaleLowerCase().includes(term) ||
        product.nameEn.toLocaleLowerCase().includes(term) ||
        product.barcode.includes(term)
      );
    });
  }, [products, search, isArabic]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [cart]
  );

  const discountAmount = subtotal * (discountPercent / 100);
  const total = Math.max(0, subtotal - discountAmount);

  function addProduct(product: CashierProduct) {
    setMessage("");

    if (product.stock <= 0) {
      setMessage(t.outOfStock);
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        if (existing.quantity >= product.stock) {
          setMessage(t.outOfStock);
          return current;
        }

        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        { product, quantity: 1, discount: 0 },
      ];
    });
  }

  function addBarcode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = barcode.trim();

    if (!value) {
      setMessage(t.invalidBarcode);
      return;
    }

    const product = products.find(
      (item) => item.barcode === value
    );

    if (!product) {
      setMessage(t.unknownBarcode);
      return;
    }

    addProduct(product);
    setBarcode("");
  }

  function changeQuantity(productId: string, delta: number) {
    setMessage("");

    setCart((current) =>
      current
        .map((item) => {
          if (item.product.id !== productId) return item;

          const nextQuantity = item.quantity + delta;

          if (nextQuantity <= 0) return null;

          if (nextQuantity > item.product.stock) {
            setMessage(t.outOfStock);
            return item;
          }

          return { ...item, quantity: nextQuantity };
        })
        .filter((item): item is CartItem => item !== null)
    );
  }

  function removeProduct(productId: string) {
    setCart((current) =>
      current.filter((item) => item.product.id !== productId)
    );
    setMessage("");
  }

  function clearCart() {
    setCart([]);
    setDiscountPercent(0);
    setMessage("");
  }
    function checkout() {
    setMessage("");

    if (cart.length === 0) {
      setMessage(t.noProducts);
      return;
    }

    if (
      !Number.isFinite(discountPercent) ||
      discountPercent < 0 ||
      discountPercent > 10
    ) {
      setMessage(t.invalidDiscount);
      return;
    }

    if (!onCompleteSale) {
      setMessage(t.saleUnavailable);
      setShowPayment(false);
      return;
    }

    onCompleteSale(cart, paymentMethod, total);
    setShowPayment(false);
  }

  return (
    <div className="viblen-pos" style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>{t.title}</h1>
          <div style={styles.subtitle}>{t.subtitle}</div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            style={styles.button}
            onClick={() => setShowCart((value) => !value)}
          >
            {showCart ? t.products : t.cart} ({cart.length})
          </button>

          <button
            type="button"
            style={styles.button}
            onClick={() => setShowCameraNotice(true)}
          >
            {t.camera}
          </button>
        </div>
      </header>

      <div style={styles.layout}>
        {(!showCart || !showCart) && (
          <section
            style={{
              ...styles.panel,
              display: showCart ? "none" : "block",
            }}
          >
            <h2 style={styles.sectionTitle}>{t.products}</h2>

            <div style={{ marginBottom: 12 }}>
              <input
                style={styles.input}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.search}
                aria-label={t.search}
              />
            </div>

            <form
              onSubmit={addBarcode}
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 18,
              }}
            >
              <input
                style={styles.input}
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
                placeholder={t.barcodePlaceholder}
                aria-label={t.barcode}
              />

              <button type="submit" style={styles.primaryButton}>
                {t.addBarcode}
              </button>
            </form>

            {filteredProducts.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: 17, fontWeight: 750 }}>
                  {t.emptyProducts}
                </div>
                <div style={styles.muted}>{t.emptyProductsHint}</div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
                  gap: 12,
                }}
              >
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    style={{
                      border: "1px solid #e3e8f0",
                      borderRadius: 12,
                      padding: 14,
                      minWidth: 0,
                    }}
                  >
                    <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>
                      {isArabic ? product.nameAr : product.nameEn}
                    </h3>

                    <div style={styles.muted}>
                      {t.barcode}: {product.barcode}
                    </div>

                    <div style={{ marginTop: 8, fontWeight: 750 }}>
                      {t.price}: {product.price.toFixed(2)}
                    </div>

                    <div style={styles.muted}>
                      {t.available}: {product.stock}
                    </div>

                    <button
                      type="button"
                      style={{
                        ...styles.primaryButton,
                        width: "100%",
                        marginTop: 12,
                        opacity: product.stock <= 0 ? 0.55 : 1,
                      }}
                      disabled={product.stock <= 0}
                      onClick={() => addProduct(product)}
                    >
                      {t.add}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {(!showCart || showCart) && (
          <section
            style={{
              ...styles.panel,
              display: showCart ? "block" : "block",
            }}
          >
            <div style={styles.row}>
              <h2 style={styles.sectionTitle}>{t.cart}</h2>

              {cart.length > 0 && (
                <button
                  type="button"
                  style={styles.button}
                  onClick={clearCart}
                >
                  {t.clear}
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: 17, fontWeight: 750 }}>
                  {t.emptyCart}
                </div>
                <div style={styles.muted}>{t.emptyCartHint}</div>
              </div>
            ) : (
              <div>
                {cart.map((item) => (
                  <article
                    key={item.product.id}
                    style={{
                      padding: "14px 0",
                      borderBottom: "1px solid #e8edf3",
                    }}
                  >
                    <div style={styles.row}>
                      <strong>
                        {isArabic
                          ? item.product.nameAr
                          : item.product.nameEn}
                      </strong>

                      <button
                        type="button"
                        style={styles.button}
                        onClick={() => removeProduct(item.product.id)}
                      >
                        {t.remove}
                      </button>
                    </div>

                    <div style={{ ...styles.muted, marginTop: 6 }}>
                      {item.product.price.toFixed(2)} × {item.quantity}
                    </div>

                    <div
                      style={{
                        ...styles.row,
                        marginTop: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          style={styles.button}
                          aria-label={t.decrease}
                          onClick={() =>
                            changeQuantity(item.product.id, -1)
                          }
                        >
                          −
                        </button>

                        <strong
                          style={{
                            minWidth: 24,
                            textAlign: "center",
                            alignSelf: "center",
                          }}
                        >
                          {item.quantity}
                        </strong>

                        <button
                          type="button"
                          style={styles.button}
                          aria-label={t.increase}
                          onClick={() =>
                            changeQuantity(item.product.id, 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <strong>
                        {(item.product.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  </article>
                ))}

                <hr style={styles.separator} />

                <div style={styles.row}>
                  <span>{t.subtotal}</span>
                  <strong>{subtotal.toFixed(2)}</strong>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label
                    htmlFor="viblen-discount"
                    style={{ display: "block", marginBottom: 8 }}
                  >
                    {t.discountPercent}
                  </label>

                  <input
                    id="viblen-discount"
                    style={styles.input}
                    type="number"
                    min="0"
                    max="10"
                    step="1"
                    value={discountPercent}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setDiscountPercent(
                        Number.isFinite(value)
                          ? Math.min(10, Math.max(0, value))
                          : 0
                      );
                    }}
                  />
                </div>

                <div style={{ ...styles.row, marginTop: 16 }}>
                  <span>{t.discount}</span>
                  <strong>{discountAmount.toFixed(2)}</strong>
                </div>

                <div
                  style={{
                    ...styles.row,
                    marginTop: 14,
                    fontSize: 19,
                  }}
                >
                  <strong>{t.total}</strong>
                  <strong>{total.toFixed(2)}</strong>
                </div>

                <button
                  type="button"
                  style={{
                    ...styles.primaryButton,
                    width: "100%",
                    marginTop: 20,
                  }}
                  onClick={() => {
                    setMessage("");
                    setShowPayment(true);
                  }}
                >
                  {t.payment}
                </button>
              </div>
            )}

            {message && <div style={styles.message}>{message}</div>}

            <div style={styles.message}>{t.saleNotice}</div>
          </section>
        )}
      </div>

      {showPayment && (
        <div
          style={styles.overlay}
          role="presentation"
          onClick={() => setShowPayment(false)}
        >
          <section
            style={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="viblen-payment-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="viblen-payment-title"
              style={styles.sectionTitle}
            >
              {t.paymentTitle}
            </h2>

            {(
              [
                ["cash", t.cash],
                ["card", t.card],
                ["other", t.other],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: 12,
                  border: "1px solid #e3e8f0",
                  borderRadius: 10,
                  marginBottom: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="viblen-payment"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                />
                {label}
              </label>
            ))}

            <div style={{ ...styles.row, margin: "18px 0" }}>
              <strong>{t.total}</strong>
              <strong>{total.toFixed(2)}</strong>
            </div>

            <div style={styles.message}>{t.saleNotice}</div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 18,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                style={styles.button}
                onClick={() => setShowPayment(false)}
              >
                {t.cancel}
              </button>

              <button
                type="button"
                style={styles.primaryButton}
                onClick={checkout}
              >
                {t.confirm}
              </button>
            </div>
          </section>
        </div>
      )}

      {showCameraNotice && (
        <div
          style={styles.overlay}
          role="presentation"
          onClick={() => setShowCameraNotice(false)}
        >
          <section
            style={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="viblen-camera-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="viblen-camera-title"
              style={styles.sectionTitle}
            >
              {t.camera}
            </h2>

            <p style={styles.muted}>{t.cameraNotice}</p>

            <button
              type="button"
              style={styles.primaryButton}
              onClick={() => setShowCameraNotice(false)}
            >
              {t.close}
            </button>
          </section>
        </div>
      )}
    </div>
  );
            }
