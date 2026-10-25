import { useState } from "react";
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

export default function App({ language }: AppProps) {
  const t = appContent[language];
  const isArabic = language === "ar";

  const [activeSection, setActiveSection] =
    useState<SectionKey>(defaultSection);

  const activeTitle = t[activeSection];
  const isOverview = activeSection === "overview";

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
