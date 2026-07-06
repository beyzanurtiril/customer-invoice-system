/*
  COMPONENT: RevenueLineChart

  Aylık gelir verisini SVG çizgi grafik olarak çizer.
  Mock veriyi doğrudan import etmez; `data` propunu kullanır.
  Min/max değerleri backend verisine göre otomatik hesaplandığı için
  veri aralığı değiştiğinde grafik ekran dışına taşmaz.

  Beklenen veri:
  [{ month: "Şub", value: 920 }]

  TASARIM:
  dashboard.css -> `.line-chart`, `.revenue-line`, `.revenue-point`, `.chart-grid-line`
*/

const width = 660;
const height = 205;
const chartLeft = 52;
const chartRight = 618;
const chartTop = 28;
const chartBottom = 176;
const tickCount = 4;

function formatAxisValue(value) {
  return (value / 1000).toFixed(1).replace(".", ",");
}

function calculateScale(data) {
  const values = data.map((point) => Number(point.value)).filter(Number.isFinite);

  if (!values.length) {
    return { minValue: 0, maxValue: 1 };
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const difference = rawMax - rawMin;
  const padding = Math.max(difference * 0.2, rawMax * 0.05, 1);

  return {
    minValue: Math.max(0, Math.floor((rawMin - padding) / 100) * 100),
    maxValue: Math.ceil((rawMax + padding) / 100) * 100,
  };
}

export default function RevenueLineChart({
  data = [],
  title = "Aylık gelir trendi",
  subtitle = "Son 6 ay · bin ₺",
}) {
  const { minValue, maxValue } = calculateScale(data);
  const valueRange = Math.max(1, maxValue - minValue);

  const points = data.map((point, index) => {
    // Tek veri noktası gelirse grafiğin ortasına yerleştirilir.
    const x =
      data.length === 1
        ? (chartLeft + chartRight) / 2
        : chartLeft + ((chartRight - chartLeft) * index) / (data.length - 1);
    const numericValue = Number(point.value) || 0;
    const y = chartBottom - ((numericValue - minValue) / valueRange) * (chartBottom - chartTop);

    return { ...point, value: numericValue, x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const ticks = Array.from({ length: tickCount }, (_, index) => {
    const ratio = index / (tickCount - 1);
    return maxValue - ratio * valueRange;
  });

  return (
    <article className="dashboard-card chart-card chart-card--wide">
      <div className="card-heading">
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>

      {points.length ? (
        <svg
          className="line-chart"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={title}
        >
          {ticks.map((value, index) => {
            const y = chartTop + (index * (chartBottom - chartTop)) / (tickCount - 1);

            return (
              <g key={`${value}-${index}`}>
                <line x1="42" y1={y} x2="630" y2={y} className="chart-grid-line" />
                <text x="8" y={y + 4} className="chart-axis-label">
                  {formatAxisValue(value)}
                </text>
              </g>
            );
          })}

          <path d={path} className="revenue-line" pathLength="1" />

          {points.map((point, index) => (
            <g key={`${point.month}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4.5"
                className="revenue-point"
                style={{ animationDelay: `${0.45 + index * 0.08}s` }}
              />
              <text x={point.x} y="197" textAnchor="middle" className="chart-axis-label">
                {point.month}
              </text>
            </g>
          ))}
        </svg>
      ) : (
        <div className="empty-state">Gelir trendi verisi bulunamadı.</div>
      )}
    </article>
  );
}
