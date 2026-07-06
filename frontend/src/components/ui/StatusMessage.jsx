/*
  COMPONENT: StatusMessage

  Loading, bilgi veya hata mesajlarını tek tip kutuda gösterir.
  tone="danger" olduğunda ekran okuyuculara acil hata olarak `alert` rolü verir.

  action propuna "Tekrar dene" gibi bir buton verilebilir.
  TASARIM: customers.css -> `.status-message`, `.status-message--danger`
*/

export default function StatusMessage({ tone = "info", children, action }) {
  return (
    <div
      className={`status-message status-message--${tone}`}
      role={tone === "danger" ? "alert" : "status"}
    >
      <span>{children}</span>
      {action}
    </div>
  );
}
