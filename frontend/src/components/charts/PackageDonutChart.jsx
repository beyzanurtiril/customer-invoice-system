/*
  COMPONENT: PackageDonutChart

  Paket dağılımını donut grafik olarak gösterir.
  Veri backend'den yüzde veya adet olarak gelebilir;
  component toplamı hesaplayıp her parçanın oranını kendi çıkarır.

  Beklenen veri:
  [{ label: "İnternet ağırlıklı", value: 45, tone: "accent" }]

  TASARIM:
  dashboard.css -> `.donut-layout`, `.donut-chart`, `.donut-segment`, `.donut-legend`
*/

const radius = 48;
const circumference = 2 * Math.PI * radius;

// Backend'in tasarım rengini doğrudan belirlemesi yerine sınırlı tone değerleri kullanılır.
const toneColors = {
  accent: "var(--accent)",
  blue: "var(--blue)",
  gray: "var(--gray, #b9b9b9)",
  line: "var(--line)",
};

function formatCount(value) {
  return new Intl.NumberFormat("tr-TR").format(Number(value) || 0);
}

export default function PackageDonutChart({
  data = [],
  totalLines = 0,
  title = "Paket dağılımı",
  subtitle = "Aktif hatlar",
}) {
  const totalValue = data.reduce((total, segment) => total + (Number(segment.value) || 0), 0);

  // Her segment için SVG çizgi uzunluğu ve başlangıç konumu hesaplanır.
  const segments = data.reduce((result, segment) => {
    const accumulatedValue = result.reduce((total, item) => total + item.numericValue, 0);
    const numericValue = Number(segment.value) || 0;
    const ratio = totalValue > 0 ? numericValue / totalValue : 0;
    const segmentLength = ratio * circumference;
    const accumulatedRatio = totalValue > 0 ? accumulatedValue / totalValue : 0;

    return [
      ...result,
      {
        ...segment,
        numericValue,
        percentage: Math.round(ratio * 100),
        segmentLength,
        dashOffset: -accumulatedRatio * circumference,
      },
    ];
  }, []);

  return (
    <article className="dashboard-card chart-card">
      <div className="card-heading">
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>

      {segments.length && totalValue > 0 ? (
        <div className="donut-layout">
          <div className="donut-chart-wrap">
            <svg className="donut-chart" viewBox="0 0 120 120" role="img" aria-label={title}>
              <circle cx="60" cy="60" r={radius} className="donut-track" />

              {segments.map((segment, index) => (
                <circle
                  key={segment.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  className="donut-segment"
                  stroke={toneColors[segment.tone] ?? toneColors.gray}
                  strokeDasharray={`${segment.segmentLength} ${
                    circumference - segment.segmentLength
                  }`}
                  strokeDashoffset={segment.dashOffset}
                  style={{
                    "--segment-length": segment.segmentLength,
                    "--circle-length": circumference,
                    animationDelay: `${index * 0.12}s`,
                  }}
                />
              ))}
            </svg>

            <div className="donut-center">
              <strong>{formatCount(totalLines)}</strong>
              <span>hat</span>
            </div>
          </div>

          <div className="donut-legend">
            {segments.map((segment) => (
              <div key={segment.label}>
                <span
                  className="legend-dot"
                  style={{ background: toneColors[segment.tone] ?? toneColors.gray }}
                />
                <span>
                  {segment.label} · %{segment.percentage}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">Paket dağılımı verisi bulunamadı.</div>
      )}
    </article>
  );
}
