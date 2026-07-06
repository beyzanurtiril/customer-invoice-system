/*
  COMPONENT: CityRevenueBarChart

  Şehir bazlı gelir verisini sütun grafik olarak çizer.
  Bu component backend'e veya mockData dosyasına doğrudan bağlanmaz.
  Veriyi `data` propuyla DashboardPage'ten alır.

  Beklenen veri:
  [{ city: "İstanbul", value: 412, group: "Büyükşehir" }]

  TASARIM:
  dashboard.css -> `.bar-chart`, `.bar-column`, `.bar-fill`, `.chart-legend`
*/

export default function CityRevenueBarChart({
  data = [],
  title = "Şehir bazlı gelir",
  subtitle = "Bu ay · bin ₺",
}) {
  // Boş array geldiğinde Math.max(...[]) -Infinity verir; 1 ekleyerek hesabı güvenli tutuyoruz.
  const maxValue = Math.max(1, ...data.map((item) => Number(item.value) || 0));

  return (
    <article className="dashboard-card chart-card chart-card--wide">
      <div className="card-heading">
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>

      {data.length ? (
        <div className="bar-chart" role="img" aria-label={`${title} grafiği`}>
          {data.map((item, index) => {
            const numericValue = Number(item.value) || 0;

            return (
              <div className="bar-column" key={item.city}>
                <span className="bar-value" style={{ animationDelay: `${0.35 + index * 0.08}s` }}>
                  {numericValue}
                </span>

                <div className="bar-track">
                  <div
                    className={`bar-fill ${
                      item.group === "Büyükşehir" ? "bar-fill--accent" : "bar-fill--blue"
                    }`}
                    style={{
                      // En küçük değer bile görünür olsun diye minimum 18px kullanılır.
                      height: `${Math.max(18, (numericValue / maxValue) * 124)}px`,
                      animationDelay: `${index * 0.08}s`,
                    }}
                  />
                </div>

                <span>{item.city}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">Şehir geliri verisi bulunamadı.</div>
      )}

      <div className="chart-legend">
        <span>
          <i className="legend-dot legend-dot--accent" /> Büyükşehir
        </span>
        <span>
          <i className="legend-dot legend-dot--blue" /> Bölge merkezi
        </span>
      </div>
    </article>
  );
}
