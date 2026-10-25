import { useState } from "react";
import type { FormEvent } from "react";
import type { Language } from "./i18n";
import {
  navigationItems,
  defaultSection,
} from "./app/navigation";
import type { SectionKey } from "./app/navigation";
import { appContent } from "./app/translations";

type AppProps = {
  language: Language;
};

type DiscountType = "none" | "percent" | "fixed";

type Product = {
  id: string;
  name: string;
  barcode: string;
  category: string;
  purchasePrice: string;
  originalPrice: string;
  discountType: DiscountType;
  discountValue: string;
  stockQuantity: string;
  unit: string;
};

type ProductForm = Omit<Product, "id">;

const emptyProduct: ProductForm = {
  name: "",
  barcode: "",
  category: "",
  purchasePrice: "",
  originalPrice: "",
  discountType: "none",
  discountValue: "",
  stockQuantity: "",
  unit: "",
};

export default function App({ language }: AppProps) {
  const t = appContent[language];
  const isArabic = language === "ar";

  const [activeSection, setActiveSection] =
    useState<SectionKey>(defaultSection);

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] =
    useState<ProductForm>({ ...emptyProduct });
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const activeTitle = t[activeSection];
  const isOverview = activeSection === "overview";
  const isProducts = activeSection === "products";

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    return (
      product.name.toLowerCase().includes(query) ||
      product.barcode.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  function openAddForm() {
    setEditingId(null);
    setFormData({ ...emptyProduct });
    setFormError("");
    setNotice("");
    setFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingId(product.id);

    setFormData({
      name: product.name,
      barcode: product.barcode,
      category: product.category,
      purchasePrice: product.purchasePrice,
      originalPrice: product.originalPrice,
      discountType: product.discountType,
      discountValue: product.discountValue,
      stockQuantity: product.stockQuantity,
      unit: product.unit,
    });

    setFormError("");
    setNotice("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setFormData({ ...emptyProduct });
    setFormError("");
  }

  function getDiscountAmount(
    product: Pick<
      Product,
      "originalPrice" | "discountType" | "discountValue"
    >,
  ): number {
    const originalPrice = Number(product.originalPrice);
    const discountValue = Number(product.discountValue);

    if (
      product.discountType === "none" ||
      product.discountValue.trim() === "" ||
      !Number.isFinite(originalPrice) ||
      !Number.isFinite(discountValue)
    ) {
      return 0;
    }

    if (product.discountType === "percent") {
      return Math.min(
        originalPrice,
        (originalPrice * discountValue) / 100,
      );
    }

    return Math.min(originalPrice, discountValue);
  }

  function getFinalPrice(
    product: Pick<
      Product,
      "originalPrice" | "discountType" | "discountValue"
    >,
  ): number {
    return Math.max(
      0,
      Number(product.originalPrice) -
        getDiscountAmount(product),
    );
  }

  function formatPrice(value: string | number): string {
    return new Intl.NumberFormat(
      isArabic ? "ar-EG" : "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    ).format(Number(value));
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError("");
    setNotice("");

    const name = formData.name.trim();
    const barcode = formData.barcode.trim();
    const category = formData.category.trim();
    const purchasePrice = formData.purchasePrice.trim();
    const originalPrice = formData.originalPrice.trim();
    const discountType = formData.discountType;
    const discountValue = formData.discountValue.trim();
    const stockQuantity = formData.stockQuantity.trim();
    const unit = formData.unit.trim();

    if (!name) {
      setFormError(t.productRequired);
      return;
    }

    if (
      (purchasePrice !== "" &&
        (!Number.isFinite(Number(purchasePrice)) ||
          Number(purchasePrice) < 0)) ||
      originalPrice === "" ||
      !Number.isFinite(Number(originalPrice)) ||
      Number(originalPrice) < 0
    ) {
      setFormError(t.invalidPrice);
      return;
    }

    if (discountType !== "none") {
      const numericDiscount = Number(discountValue);
      const numericOriginalPrice = Number(originalPrice);

      if (
        discountValue === "" ||
        !Number.isFinite(numericDiscount) ||
        numericDiscount < 0 ||
        (discountType === "percent" &&
          numericDiscount > 100) ||
        (discountType === "fixed" &&
          numericDiscount > numericOriginalPrice)
      ) {
        setFormError(t.invalidDiscount);
        return;
      }
    }

    if (
      stockQuantity === "" ||
      !Number.isFinite(Number(stockQuantity)) ||
      Number(stockQuantity) < 0
    ) {
      setFormError(t.invalidQuantity);
      return;
    }

    const duplicateBarcode =
      barcode !== "" &&
      products.some(
        (product) =>
          product.barcode.trim() === barcode &&
          product.id !== editingId,
      );

    if (duplicateBarcode) {
      setFormError(t.duplicateBarcode);
      return;
    }

    const product: Product = {
      id: editingId ?? crypto.randomUUID(),
      name,
      barcode,
      category,
      purchasePrice,
      originalPrice,
      discountType,
      discountValue:
        discountType === "none" ? "" : discountValue,
      stockQuantity,
      unit,
    };

    if (editingId) {
      setProducts((current) =>
        current.map((item) =>
          item.id === editingId ? product : item,
        ),
      );
    } else {
      setProducts((current) => [...current, product]);
    }

    setFormOpen(false);
    setEditingId(null);
    setFormData({ ...emptyProduct });
    setNotice(t.productSaved);
  }

  function deleteProduct(id: string) {
    setProducts((current) =>
      current.filter((product) => product.id !== id),
    );

    setNotice(t.success);
      }
    
  function changeSection(section: SectionKey) {
    setActiveSection(section);
    setFormOpen(false);
    setFormError("");
    setNotice("");
  }

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
          {navigationItems.map((item) => {
            const isActive = activeSection === item.key;

            return (
              <a
                key={item.key}
                href={`#${item.key}`}
                className={`nav-item ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  changeSection(item.key);
                }}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{t[item.key]}</span>
                {isActive && <span className="active-indicator" />}
              </a>
            );
          })}
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
            <strong>{activeTitle}</strong>
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
          {isOverview ? (
            <>
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
            </>
          ) : isProducts ? (
            <>
              <div className="welcome-section">
                <div>
                  <span className="eyebrow">{t.workspace}</span>
                  <h1>{t.productManagement}</h1>
                  <p>{t.productDetails}</p>
                </div>

                {!formOpen && (
                  <button type="button" onClick={openAddForm}>
                    + {t.addProduct}
                  </button>
                )}
              </div>

              {notice && (
                <p role="status" className="success-message">
                  {notice}
                </p>
              )}

              {formOpen && (
                <section className="setup-card">
                  <div className="setup-copy">
                    <h2>
                      {editingId ? t.editProduct : t.addProduct}
                    </h2>

                    <form onSubmit={saveProduct}>
                      <label>
                        {t.productName} *
                        <input
                          required
                          value={formData.name}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              name: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        {t.barcode}
                        <input
                          value={formData.barcode}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              barcode: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        {t.category}
                        <input
                          value={formData.category}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              category: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        {t.purchasePrice}
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.purchasePrice}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              purchasePrice: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        {t.originalPrice} *
                        <input
                          required
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.originalPrice}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              originalPrice: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        {t.discountType}
                        <select
                          value={formData.discountType}
                          onChange={(event) => {
                            const discountType =
                              event.target.value as DiscountType;

                            setFormData({
                              ...formData,
                              discountType,
                              discountValue:
                                discountType === "none"
                                  ? ""
                                  : formData.discountValue,
                            });
                          }}
                        >
                          <option value="none">
                            {t.noDiscount}
                          </option>
                          <option value="percent">
                            {t.percentageDiscount}
                          </option>
                          <option value="fixed">
                            {t.fixedDiscount}
                          </option>
                        </select>
                      </label>

                      {formData.discountType !== "none" && (
                        <label>
                          {t.discountValue}
                          <input
                            required
                            type="number"
                            min="0"
                            max={
                              formData.discountType === "percent"
                                ? 100
                                : formData.originalPrice || undefined
                            }
                            step="0.01"
                            value={formData.discountValue}
                            onChange={(event) =>
                              setFormData({
                                ...formData,
                                discountValue: event.target.value,
                              })
                            }
                          />
                        </label>
                      )}

                      <div className="price-preview">
                        <span>{t.finalPrice}</span>
                        <strong>
                          {formData.originalPrice !== "" &&
                          Number.isFinite(Number(formData.originalPrice)) &&
                          Number(formData.originalPrice) >= 0 &&
                          (formData.discountType === "none" ||
                            (formData.discountValue !== "" &&
                              Number.isFinite(Number(formData.discountValue)) &&
                              Number(formData.discountValue) >= 0 &&
                              (formData.discountType !== "percent" ||
                                Number(formData.discountValue) <= 100) &&
                              (formData.discountType !== "fixed" ||
                                Number(formData.discountValue) <=
                                  Number(formData.originalPrice))))
                            ? formatPrice(
                                getFinalPrice({
                                  originalPrice: formData.originalPrice,
                                  discountType: formData.discountType,
                                  discountValue: formData.discountValue,
                                }),
                              )
                            : "—"}
                        </strong>
                      </div>

                      {formError && (
                        <p role="alert" className="error-message">
                          {formError}
                        </p>
                      )}

                      <div className="form-actions">
                        <button type="submit">{t.save}</button>
                        <button type="button" onClick={closeForm}>
                          {t.cancel}
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              )}

              <section className="setup-card">
                <div className="setup-copy">
                  <h2>{t.productManagement}</h2>
                  <p>
                    {t.productCode}: {products.length}
                  </p>

                  <input
                    type="search"
                    aria-label={t.search}
                    placeholder={t.productSearchPlaceholder}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />

                  {filteredProducts.length === 0 ? (
                    <p>
                      {products.length === 0
                        ? t.noProducts
                        : t.noResults}
                    </p>
                  ) : (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>{t.productName}</th>
                            <th>{t.barcode}</th>
                            <th>{t.category}</th>
                            <th>{t.purchasePrice}</th>
                            <th>{t.originalPrice}</th>
                            <th>{t.discount}</th>
                            <th>{t.finalPrice}</th>
                            <th>{t.stockQuantity}</th>
                            <th>{t.actions}</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr key={product.id}>
                              <td>{product.name}</td>
                              <td>{product.barcode || "—"}</td>
                              <td>{product.category || "—"}</td>
                              <td>
                                {product.purchasePrice.trim() !== ""
                                  ? formatPrice(product.purchasePrice)
                                  : "—"}
                              </td>
                              <td>{formatPrice(product.originalPrice)}</td>
                              <td>
                                {product.discountType === "none"
                                  ? "—"
                                  : product.discountType === "percent"
                                    ? `${product.discountValue}%`
                                    : formatPrice(product.discountValue)}
                              </td>
                              <td>
                                {formatPrice(getFinalPrice(product))}
                              </td>
                              <td>
                                {product.stockQuantity}
                                {product.unit ? ` ${product.unit}` : ""}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => openEditForm(product)}
                                >
                                  {t.edit}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        isArabic
                                          ? "هل تريد حذف هذا المنتج؟"
                                          : "Delete this product?",
                                      )
                                    ) {
                                      deleteProduct(product.id);
                                    }
                                  }}
                                >
                                  {t.delete}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : (
            <section className="setup-card">
              <div className="setup-icon" aria-hidden="true">
                <span>
                  {
                    navigationItems.find(
                      (item) => item.key === activeSection,
                    )?.icon
                  }
                </span>
              </div>

              <div className="setup-copy">
                <span className="status-label">
                  <span className="status-dot" />
                  {t.status}
                </span>
                <h2>{activeTitle}</h2>
                <p>{t.sectionDescription}</p>
              </div>
            </section>
          )}

          <footer className="page-footer">{t.footer}</footer>
        </section>
      </main>
    </div>
  );
          }
              
