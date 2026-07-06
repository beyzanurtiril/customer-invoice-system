/*
  COMPONENT: StatCard

  Dashboard'un üst kısmındaki tek bir özet kartı oluşturur.
  label, value, change ve tone değerleri backend dashboard cevabından gelir.

  TASARIM:
  dashboard.css -> `.stat-card` ve `.stat-card--warning/.stat-card--danger`
*/

export default function StatCard({ label, value, change, tone = "default" }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{change}</small>
    </article>
  );
}
