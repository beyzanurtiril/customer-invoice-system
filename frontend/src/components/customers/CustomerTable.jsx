/*
  COMPONENT: CustomerTable

  Müşteri listesini tablo halinde gösterir.
  Yükleniyor, boş liste, satıra tıklama ve üç nokta menüsü durumlarını yönetir.

  Bu component veriyi çekmez veya filtrelemez.
  CustomersPage.jsx tarafından hazırlanan `customers` listesini ekrana basar.

  TASARIM:
  - Dış kart: customers.css -> `.table-wrap`
  - Tablo: `.customer-table`
  - Kolon genişlikleri: `.customer-table th:nth-child(...)`
  - Satır hover: `.customer-table tbody tr:hover`
  - Üç nokta: `.row-menu-button`
  - Boş durum: `.empty-state`
  - Loading satırı: `.table-state-row`
*/
import { getCustomerTagTone } from "../../utils/customerFilter";
import Badge from "../ui/Badge";

// Props:
// customers      -> Gösterilecek müşteri listesi.
// loading        -> Veriler yüklenirken true.
// onOpenCustomer -> Satıra tıklanınca detay açar.
// onOpenMenu     -> Üç noktaya tıklanınca işlem menüsünü açar.
export default function CustomerTable({ customers, loading, onOpenCustomer, onOpenMenu }) {
  return (
    <div className="table-wrap">
      <table className="customer-table">
        <thead>
          <tr>
            <th>MÜŞTERİ</th>
            <th>HAT TİPİ</th>
            <th>ŞEHİR</th>
            <th>ETİKET</th>
            <th>SON FATURA</th>
            <th>DURUM</th>
            {/*
              Son kolonun görünen başlığı yoktur.
              aria-label ekran okuyucular için kolonun amacını açıklar.
            */}
            <th aria-label="İşlemler" />
          </tr>
        </thead>
        <tbody>
          {loading ? (
            /*
              Yükleme sırasında gerçek müşteri satırları yerine tek satır gösterilir.
              colSpan="7", hücrenin yedi kolonun tamamını kaplamasını sağlar.
            */
            <tr className="table-state-row">
              <td colSpan="7">Müşteriler yükleniyor…</td>
            </tr>
          ) : (
            // Yükleme bittiyse her müşteri için bir tablo satırı oluşturulur.
            customers.map((customer) => (
              <tr
                key={customer.id}
                // Satırın herhangi bir yerine basılınca detay modalı açılır.
                onClick={() => onOpenCustomer(customer)}
              >
                <td>
                  <strong>{customer.name}</strong> <span>#{customer.id}</span>
                </td>
                <td>{customer.lineType}</td>
                <td>{customer.city}</td>
                <td>
                  <Badge tone={getCustomerTagTone(customer.tag)}>{customer.tag}</Badge>
                </td>
                <td>{customer.lastInvoice}</td>
                <td>
                  <Badge tone={customer.statusTone}>{customer.status}</Badge>
                </td>
                <td>
                  <button
                    className="row-menu-button"
                    onClick={(event) => {
                      /*
                        Bu buton satırın içindedir.
                        stopPropagation olmazsa üç noktaya basınca:
                        1. Menü açılır.
                        2. Tıklama satıra yayılır.
                        3. Detay modalı da açılır.

                        Bu satır tıklamanın üst satıra yayılmasını engeller.
                      */
                      event.stopPropagation();
                      onOpenMenu(customer);
                    }}
                    aria-label={`${customer.name} için işlemler`}
                  >
                    ⋯
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*
        Yükleme bittiyse ve müşteri listesi boşsa mesaj gösterilir.
        Bu durum arama sonucu bulunamadığında da kullanılır.
      */}

      {!loading && !customers.length ? (
        <div className="empty-state">Aramana uygun müşteri bulunamadı.</div>
      ) : null}
    </div>
  );
}
