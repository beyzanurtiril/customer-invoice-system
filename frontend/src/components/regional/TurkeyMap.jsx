/*
  COMPONENT: TurkeyMap

  Bölgesel sayfası için stilize Türkiye haritası.
  Backend'in /analysis/regional-payments cevabındaki bölgeler, şehir adına göre
  büyükşehir koordinatlarıyla eşleştirilir ve harita üzerinde balon olarak çizilir.

  - Balon BÜYÜKLÜĞÜ  -> bölgenin toplam geliri
  - Balon RENGİ      -> gecikmiş ödeme oranı (yeşil düşük, kırmızı yüksek)
  - Üzerine gelince  -> gelir, fatura adedi, ortalama tutar ve gecikme oranı tooltip'te

  Harita dış çizgisi elle sadeleştirilmiş bir poligondur; coğrafi hassasiyet değil
  tanınabilirlik hedeflenir. Şehir konumları gerçek enlem/boylamdan izdüşümle hesaplanır,
  bu yüzden yeni şehir eklemek için CITY_COORDINATES'e kayıt eklemek yeterlidir.
*/

import { useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

// Görünür alan: boylam 25.5–45.2, enlem 35.6–42.4 (basit eşdikdörtgen izdüşüm)
const LON_MIN = 25.5;
const LON_MAX = 45.2;
const LAT_MIN = 35.6;
const LAT_MAX = 42.4;
const MAP_WIDTH = 940;
const MAP_HEIGHT = 400;

function project(lon, lat) {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_WIDTH;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_HEIGHT;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// Büyükşehirler ve bilinen il merkezleri (lon, lat).
const CITY_COORDINATES = {
  istanbul: [28.98, 41.01],
  ankara: [32.86, 39.93],
  izmir: [27.14, 38.42],
  bursa: [29.06, 40.19],
  antalya: [30.71, 36.9],
  adana: [35.32, 37.0],
  konya: [32.49, 37.87],
  gaziantep: [37.38, 37.07],
  mersin: [34.64, 36.81],
  kayseri: [35.49, 38.72],
  eskisehir: [30.52, 39.78],
  diyarbakir: [40.24, 37.91],
  samsun: [36.33, 41.29],
  denizli: [29.09, 37.77],
  sanliurfa: [38.79, 37.16],
  malatya: [38.31, 38.35],
  trabzon: [39.72, 41.0],
  erzurum: [41.27, 39.9],
  van: [43.38, 38.49],
  kocaeli: [29.94, 40.77],
  sakarya: [30.4, 40.77],
  mugla: [28.36, 37.21],
  tekirdag: [27.51, 40.98],
  balikesir: [27.88, 39.65],
  manisa: [27.43, 38.61],
  aydin: [27.84, 37.85],
  hatay: [36.16, 36.2],
  kahramanmaras: [36.92, 37.58],
  mardin: [40.74, 37.31],
  ordu: [37.88, 40.98],
};

// Türkçe karakterleri sadeleştirip şehir adını CITY_COORDINATES anahtarına çevirir.
function normalizeCityKey(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replaceAll("â", "a")
    .replace(/\s+/g, "");
}

/*
  Sadeleştirilmiş Türkiye dış hattı (lon,lat çiftleri).
  Trakya + Anadolu tek poligonda, Boğaz bölgesinde daralarak birleşir.
*/
const OUTLINE = [
  [26.2, 41.7], [26.6, 41.8], [27.0, 42.1], [28.0, 41.5], [28.2, 41.25],
  [29.1, 41.2], [30.3, 41.2], [31.3, 41.35], [32.0, 41.85], [33.4, 42.0],
  [35.0, 42.05], [36.1, 41.6], [36.5, 41.3], [37.7, 41.1], [38.4, 40.95],
  [39.5, 41.1], [40.3, 41.0], [41.5, 41.5], [42.6, 41.6], [43.4, 41.15],
  [43.7, 40.9], [43.5, 40.45], [43.7, 40.1], [44.8, 39.7], [44.4, 39.4],
  [44.0, 39.35], [44.5, 38.4], [44.3, 37.95], [44.8, 37.6], [44.2, 37.3],
  [43.5, 37.25], [42.4, 37.15], [41.3, 37.1], [40.3, 37.1], [39.0, 36.7],
  [38.0, 36.8], [37.0, 36.65], [36.65, 36.25], [36.15, 35.85], [35.9, 36.3],
  [36.2, 36.6], [35.55, 36.6], [34.6, 36.75], [33.7, 36.15], [32.8, 36.05],
  [32.0, 36.15], [31.0, 36.85], [30.4, 36.3], [29.7, 36.15], [29.1, 36.65],
  [28.2, 36.75], [27.4, 36.95], [27.3, 37.35], [27.0, 37.7], [26.35, 38.3],
  [26.8, 38.45], [26.7, 38.95], [26.2, 39.5], [26.8, 39.6], [27.0, 40.4],
  [27.5, 40.3], [28.3, 40.4], [29.1, 40.35], [29.05, 40.95], [28.2, 41.1],
  [27.5, 40.98], [26.75, 40.6], [26.05, 40.72], [26.35, 41.25], [26.2, 41.7],
];

const outlinePath = OUTLINE
  .map(([lon, lat], index) => {
    const [x, y] = project(lon, lat);
    return `${index === 0 ? "M" : "L"}${x},${y}`;
  })
  .join(" ") + " Z";

// Gecikme oranını yeşil (iyi) -> kırmızı (kötü) skalasına çevirir.
function overdueColor(rate) {
  const clamped = Math.max(0, Math.min(100, Number(rate) || 0));
  const hue = 130 - (clamped / 100) * 130; // 130=yeşil, 0=kırmızı
  return `hsl(${hue}, 62%, 46%)`;
}

function formatMoney(value, locale) {
  return Number(value ?? 0).toLocaleString(locale, {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  });
}

export default function TurkeyMap({ items = [] }) {
  const { locale, t } = useLanguage();
  const [hovered, setHovered] = useState(null);

  const { markers, unmatched, maxRevenue } = useMemo(() => {
    const matched = [];
    const missing = [];
    let max = 0;

    items.forEach((item) => {
      const cityName = item.regionName ?? item.city ?? item.name;
      const coords = CITY_COORDINATES[normalizeCityKey(cityName)];
      const revenue = Number(item.totalRevenue ?? 0);
      if (revenue > max) max = revenue;

      if (coords) {
        const [x, y] = project(coords[0], coords[1]);
        matched.push({ ...item, cityName, x, y, revenue });
      } else {
        missing.push(cityName);
      }
    });

    return { markers: matched, unmatched: missing, maxRevenue: max };
  }, [items]);

  const radiusFor = (revenue) => {
    if (maxRevenue <= 0) return 10;
    const ratio = Math.sqrt(revenue / maxRevenue); // alan orantılı ölçek
    return 8 + ratio * 20;
  };

  const hoveredMarker = markers.find((m) => m.regionId === hovered) ?? null;

  return (
    <article className="dashboard-card chart-card turkey-map-card">
      <div className="card-heading">
        <h2>{t("regional_map_title")}</h2>
        <span>{t("regional_map_subtitle")}</span>
      </div>

      {markers.length > 0 ? (
        <div className="turkey-map-wrap" style={{ position: "relative" }}>
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            role="img"
            aria-label={t("regional_map_title")}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <path
              d={outlinePath}
              fill="var(--surface-muted, rgba(120, 130, 150, 0.12))"
              stroke="var(--line, #d7dbe2)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {markers.map((marker) => {
              const r = radiusFor(marker.revenue);
              const isActive = hovered === marker.regionId;

              return (
                <g
                  key={marker.regionId ?? marker.cityName}
                  onMouseEnter={() => setHovered(marker.regionId)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r={r}
                    fill={overdueColor(marker.overdueRatePercentage)}
                    fillOpacity={isActive ? 0.9 : 0.65}
                    stroke="var(--surface, #fff)"
                    strokeWidth={isActive ? 3 : 1.5}
                  />
                  <text
                    x={marker.x}
                    y={marker.y - r - 5}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="var(--text, #2c3038)"
                    style={{ pointerEvents: "none" }}
                  >
                    {marker.cityName}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoveredMarker ? (
            <div
              className="turkey-map-tooltip"
              style={{
                position: "absolute",
                left: `${(hoveredMarker.x / MAP_WIDTH) * 100}%`,
                top: `${(hoveredMarker.y / MAP_HEIGHT) * 100}%`,
                transform: "translate(-50%, calc(-100% - 18px))",
                background: "var(--surface, #fff)",
                border: "1px solid var(--line, #d7dbe2)",
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
                padding: "10px 14px",
                minWidth: 200,
                pointerEvents: "none",
                zIndex: 5,
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              <strong style={{ display: "block", marginBottom: 4 }}>
                {hoveredMarker.cityName}
              </strong>
              <div>
                {t("regional_map_overdue")}:{" "}
                <strong style={{ color: overdueColor(hoveredMarker.overdueRatePercentage) }}>
                  %{Number(hoveredMarker.overdueRatePercentage ?? 0).toFixed(1)}
                </strong>
              </div>
              <div>
                {t("regional_map_revenue")}: {formatMoney(hoveredMarker.totalRevenue, locale)}
              </div>
              <div>
                {t("regional_map_invoices")}:{" "}
                {Number(hoveredMarker.totalInvoiceCount ?? 0).toLocaleString(locale)}
              </div>
              <div>
                {t("regional_map_average")}: {formatMoney(hoveredMarker.averageInvoiceAmount, locale)}
              </div>
            </div>
          ) : null}

          <div
            className="turkey-map-legend"
            style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, fontSize: 12 }}
          >
            <span>{t("regional_map_legend_low")}</span>
            <span
              style={{
                flex: "0 0 140px",
                height: 8,
                borderRadius: 4,
                background: "linear-gradient(90deg, hsl(130,62%,46%), hsl(65,62%,46%), hsl(0,62%,46%))",
              }}
            />
            <span>{t("regional_map_legend_high")}</span>
            <span style={{ marginLeft: "auto", opacity: 0.7 }}>{t("regional_map_size_hint")}</span>
          </div>

          {unmatched.length > 0 ? (
            <p style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
              {t("regional_map_unmatched", { cities: unmatched.join(", ") })}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="empty-state">{t("regional_empty")}</div>
      )}
    </article>
  );
}
