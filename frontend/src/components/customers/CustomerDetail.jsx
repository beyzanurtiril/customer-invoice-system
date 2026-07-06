/*
  COMPONENT: CustomerDetail

  Seçilen müşterinin temel bilgilerini ve fatura özetini gösterir.
  Bu dosya yalnızca içeriği oluşturur; modal çerçevesi CustomerDetailModal
  tarafından sağlanır.

  customer objesinde kullanılan alanlar:
  name, phone, email, tag, lineType, packageName, city,
  lastInvoice, statusTone ve status.

  TASARIM:
  - Ana detay yapısı: customers.css -> `.customer-detail`
  - Üst profil alanı: `.customer-detail__top`
  - Büyük avatar: layout.css -> `.avatar`, `.avatar--large`
  - Bilgi kartları: customers.css -> `.detail-grid`
  - Fatura listesi: customers.css -> `.invoice-list`
  - Durum etiketleri: customers.css -> `.badge...`
*/
import Badge from "../ui/Badge";
import { getCustomerTagTone } from "../../utils/customerFilter";

export default function CustomerDetail({ customer }) {
  // Müşteri seçilmemişse detay içeriği render edilmez.
  if (!customer) return null;

  return (
    <div className="customer-detail">
      {/* Avatar, telefon, e-posta ve müşteri etiketi. */}
      <div className="customer-detail__top">
        <div className="avatar avatar--large">
          {/*
            İsim boşluklardan ayrılır ve her kelimenin ilk harfi alınır.

            Örnek:
            "Mehmet Kaya" -> ["Mehmet", "Kaya"] -> "MK"

            `slice(0, 2)` en fazla iki harf gösterir.
          */}
          {customer.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <strong>{customer.phone}</strong>
          <span>{customer.email}</span>
          {/*
            Müşteri etiketi "Riskli" ise kırmızı danger badge,
            diğer bütün durumlarda yeşil success badge gösterilir.

            Badge tasarımı customers.css içindeki `.badge--danger`
            ve `.badge--success` sınıflarından gelir.
          */}
          <Badge tone={getCustomerTagTone(customer.tag)}>{customer.tag} müşteri</Badge>
        </div>
      </div>
      {/* Hat tipi, paket ve şehir bilgisini üç küçük kart halinde gösterir. */}
      <div className="detail-grid">
        <div>
          <span>HAT TİPİ</span>
          <strong>{customer.lineType}</strong>
        </div>
        <div>
          <span>PAKET</span>
          <strong>{customer.packageName}</strong>
        </div>
        <div>
          <span>ŞEHİR</span>
          <strong>{customer.city}</strong>
        </div>
      </div>

      <h3>FATURA ÖZETİ</h3>
      <div className="invoice-list">
        {/*
          Güncel ayın tutarı ve durumu müşteri objesinden gelir.
          `statusTone`, Badge componentine hangi rengin kullanılacağını söyler.
        */}
        <div>
          <span>Temmuz 2026</span>
          <strong>{customer.lastInvoice}</strong>
          <Badge tone={customer.statusTone}>{customer.status}</Badge>
        </div>
        {/*
          Aşağıdaki iki geçmiş fatura şu an sabit/mock veridir.
          Bunların müşteriye göre değişmesi istenirse backend verisine veya
          customer.invoices gibi bir listeye çevrilmelidir.
        */}
        <div>
          <span>Haziran 2026</span>
          <strong>590 ₺</strong>
          <Badge tone="success">Ödendi</Badge>
        </div>
        <div>
          <span>Mayıs 2026</span>
          <strong>560 ₺</strong>
          <Badge tone="success">Ödendi</Badge>
        </div>
      </div>
    </div>
  );
}
