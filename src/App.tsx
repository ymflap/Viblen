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

type Product = {
  id: string;
  name: string;
  barcode: string;
  category: string;
  purchasePrice: string;
  sellingPrice: string;
  stockQuantity: string;
  unit: string;
};

const emptyProduct = {
  name: "",
  barcode: "",
  category: "",
  purchasePrice: "",
  sellingPrice: "",
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
  const [formData, setFormData] = useState(emptyProduct);
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
      sellingPrice: product.sellingPrice,
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

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const name = formData.name.trim();
    const barcode = formData.barcode.trim();
    const category = formData.category.trim();
    const purchasePrice = formData.purchasePrice.trim();
    const sellingPrice = formData.sellingPrice.trim();
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
      sellingPrice === "" ||
      !Number.isFinite(Number(sellingPrice)) ||
      Number(sellingPrice) < 0
    ) {
      setFormError(t.invalidPrice);
      return;
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
      sellingPrice,
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

  function formatPrice(value: string) {
    return new Intl.NumberFormat(
      isArabic ? "ar-EG" : "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    ).format(Number(value));
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
                  setActiveSection(item.key);
                  setFormOpen(false);
                  setFormError("");
                  setNotice("");
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
                        {t.sellingPrice} *
                        <input
                          required
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.sellingPrice}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              sellingPrice: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        {t.stockQuantity} *
                        <input
                          required
                          type="number"
                          min="0"
                          step="any"
                          value={formData.stockQuantity}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              stockQuantity: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        {t.unit}
                        <input
                          value={formData.unit}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              unit: event.target.value,
                            })
                          }
                        />
                      </label>

                      {formError && (
                        <p role="alert" className="error-message">
                          {formError}
                        </p>
                      )}

                      <div className="form-actions">
                        <button type="submit">{t.save}</button>
                        <button
                          type="button"
                          onClick={closeForm}
                        >
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
                            <th>{t.sellingPrice}</th>
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
                                {formatPrice(product.sellingPrice)}
                              </td>
                              <td>
                                {product.stockQuantity}
                                {product.unit
                                  ? ` ${product.unit}`
                                  : ""}
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
