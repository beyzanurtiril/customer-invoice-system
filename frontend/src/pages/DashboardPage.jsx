/*
  PAGE: DashboardPage

  Ana sayfanın bütün dashboard bölümlerini bir araya getirir.
  Backend çağrısı burada doğrudan yapılmaz; useDashboardData hook'u kullanılır.

  Veri akışı:
  dashboardService -> useDashboardData -> DashboardPage -> grafik/kart componentleri
*/

import { useState } from "react";
import CityRevenueBarChart from "../components/charts/CityRevenueBarChart";
import PackageDonutChart from "../components/charts/PackageDonutChart";
import RevenueLineChart from "../components/charts/RevenueLineChart";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import StatCard from "../components/dashboard/StatCard";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import StatusMessage from "../components/ui/StatusMessage";
import useDashboardData from "../hooks/useDashboardData";

export default function DashboardPage() {
  // Yalnızca önerilerin tamamını gösteren modalın açık/kapalı durumunu yönetir.
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);

  // Dashboard verisi, loading ve hata durumu hook'tan gelir.
  const { data, loading, error, reload } = useDashboardData();

  if (loading && !data) {
    return (
      <section className="page-content">
        <div className="page-heading">
          <h1>Ana sayfa</h1>
          <p>Dashboard verileri hazırlanıyor…</p>
        </div>
        <StatusMessage>Dashboard yükleniyor…</StatusMessage>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="page-content">
        <div className="page-heading">
          <h1>Ana sayfa</h1>
          <p>Dashboard yüklenemedi.</p>
        </div>
        <StatusMessage tone="danger" action={<Button onClick={reload}>Tekrar dene</Button>}>
          {error}
        </StatusMessage>
      </section>
    );
  }

  // API eksik alan döndürürse sayfanın tamamen çökmesini önleyen varsayılanlar.
  const stats = data?.stats ?? [];
  const revenuePoints = data?.revenuePoints ?? [];
  const packageDistribution = data?.packageDistribution ?? [];
  const cityRevenue = data?.cityRevenue ?? [];
  const recommendations = data?.recommendations ?? [];

  return (
    <section className="page-content">
      <div className="page-heading">
        <h1>Ana sayfa</h1>
        <p>{data?.periodLabel ?? "Genel bakış"}</p>
      </div>

      {/* Önceden yüklenmiş veri varken yenileme hatası oluşursa içerik kaybolmadan mesaj gösterilir. */}
      {error ? (
        <StatusMessage tone="danger" action={<Button onClick={reload}>Tekrar dene</Button>}>
          {error}
        </StatusMessage>
      ) : null}

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={`${stat.label}-${index}`} {...stat} />
        ))}
      </div>

      <div className="dashboard-row">
        <RevenueLineChart data={revenuePoints} />
        <PackageDonutChart data={packageDistribution} totalLines={data?.activeLineCount ?? 0} />
      </div>

      <div className="dashboard-row">
        <CityRevenueBarChart data={cityRevenue} />
        <RecommendationCard
          recommendations={recommendations}
          onOpenAll={() => setRecommendationsOpen(true)}
        />
      </div>

      <Modal
        open={recommendationsOpen}
        title="Öneri motoru çıkarımları"
        subtitle="Müşteri davranışları ve fatura verilerinden çıkarılan istatistikler."
        onClose={() => setRecommendationsOpen(false)}
        width="660px"
        footer={
          <Button variant="primary" onClick={() => setRecommendationsOpen(false)}>
            Kapat
          </Button>
        }
      >
        <div className="recommendation-list">
          {recommendations.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className={`recommendation-item recommendation-item--${item.tone}`}
            >
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Modal>
    </section>
  );
}
