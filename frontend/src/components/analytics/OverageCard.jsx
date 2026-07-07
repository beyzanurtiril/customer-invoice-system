/*
  COMPONENT: OverageCard

  Figma'daki Analizler sayfasındaki "Üst Paket Önerileri" kartının React karşılığıdır.
  Bu component backend'e veya mockData dosyasına doğrudan bağlanmaz.
  Veriyi `overage` propuyla AnalyticsPage'ten alır.

  Beklenen veri:
  {
    subtitle,
    items: [{ customerName, overageAmount, currentTier, suggestedTier }]
  }

  TASARIM:
  analytics.css -> `.overage-list`, `.overage-row`, `.overage-tier-pill`
*/

import { useLanguage } from "../../context/LanguageContext";

export default function OverageCard({ overage }) {
  const { t, tv } = useLanguage();
  if (!overage) return null;

  const { subtitle, items = [] } = overage;

  return (
    <article className="dashboard-card chart-card">
      <div className="card-heading">
        <h2>{tv(subtitle)}</h2>
      </div>

      {items.length ? (
        <div className="overage-list">
          {items.map((item) => (
            <div className="overage-row" key={item.customerName}>
              <div className="overage-row__left">
                <strong>{item.customerName}</strong>
                <span>{t("analytics_overage_label", { amount: item.overageAmount })}</span>
              </div>

              <div className="overage-row__right">
                <span className="overage-tier-pill">{item.currentTier}</span>
                <span className="overage-arrow">→</span>
                <span className="overage-tier-pill overage-tier-pill--accent">
                  {t("analytics_recommendation_label", { tier: item.suggestedTier })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">{t("analytics_overage_empty")}</div>
      )}
    </article>
  );
}
