/*
  PAGE: AnalyticsPage

  Analizler ekranının sayfa seviyesindeki merkezidir.
  Veriyi useAnalyticsData hook'undan alır ve kart componentlerine dağıtır.

  Veri akışı:
  analyticsService -> useAnalyticsData -> AnalyticsPage -> kart componentleri
*/

import OverageCard from "../components/analytics/OverageCard";
import RevenueForecastCard from "../components/analytics/RevenueForecastCard";
import Button from "../components/ui/Button";
import StatusMessage from "../components/ui/StatusMessage";
import { useLanguage } from "../context/LanguageContext";
import useAnalyticsData from "../hooks/useAnalyticsData";

export default function AnalyticsPage() {
  const { data, loading, error, reload } = useAnalyticsData();
  const { t, tv } = useLanguage();

  if (loading && !data) {
    return (
      <section className="page-content">
        <div className="page-heading">
          <h1>{t("analytics_title")}</h1>
          <p>{t("analytics_subtitle")}</p>
        </div>
        <StatusMessage>{t("analytics_loading")}</StatusMessage>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="page-content">
        <div className="page-heading">
          <h1>{t("analytics_title")}</h1>
          <p>{t("analytics_error_title")}</p>
        </div>
        <StatusMessage tone="danger" action={<Button onClick={reload}>{t("button_retry")}</Button>}>
          {tv(error)}
        </StatusMessage>
      </section>
    );
  }

  return (
    <section className="page-content">
      <div className="page-heading">
        <h1>{t("analytics_title")}</h1>
        <p>{t("analytics_subtitle")}</p>
      </div>

      {error ? (
        <StatusMessage tone="danger" action={<Button onClick={reload}>{t("button_retry")}</Button>}>
          {tv(error)}
        </StatusMessage>
      ) : null}

      <div className="dashboard-row dashboard-row--even">
        <RevenueForecastCard forecast={data?.revenueForecast} />
        <OverageCard overage={data?.overage} />
      </div>
    </section>
  );
}
