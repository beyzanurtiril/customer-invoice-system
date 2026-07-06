export default function PlaceholderPage({ title }) {
  return (
    <section className="page-content">
      <div className="page-heading">
        <h1>{title}</h1>
        <p>Bu ekran sonraki geliştirme aşamasında tamamlanacak.</p>
      </div>
      <div className="placeholder-card">
        <strong>{title} ekranı henüz tasarlanmadı.</strong>
        <span>Ana sayfa ve Müşteriler akışları şu anda kullanılabilir.</span>
      </div>
    </section>
  );
}
