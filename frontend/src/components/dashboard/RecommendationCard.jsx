/*
  COMPONENT: RecommendationCard

  Dashboard'daki kısa öneri listesini gösterir.
  Öneriler backend'den DashboardPage'e, oradan bu componente prop olarak gelir.

  TASARIM:
  dashboard.css -> `.recommendation-card`
*/

import Button from "../ui/Button";

export default function RecommendationCard({ recommendations = [], onOpenAll }) {
  return (
    <article className="dashboard-card recommendation-card">
      <div className="card-heading">
        <h2>Öneri motoru</h2>
        <span>Çıkarımlar</span>
      </div>

      {recommendations.length ? (
        <ul>
          {recommendations.map((item, index) => (
            // Aynı başlıktan iki tane gelme ihtimaline karşı index de key'e eklenir.
            <li key={`${item.title}-${index}`}>• {item.title}</li>
          ))}
        </ul>
      ) : (
        <p className="muted-copy">Gösterilecek çıkarım bulunamadı.</p>
      )}

      <Button variant="primary" onClick={onOpenAll} disabled={!recommendations.length}>
        Tüm çıkarımları gör →
      </Button>
    </article>
  );
}
