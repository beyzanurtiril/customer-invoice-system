// React içerisinden gerekli hook'ları import ediyoruz.

// useState:
// Component veya custom hook içerisinde değişebilen verileri tutar.

// useEffect:
// Component ilk açıldığında veya belirli bağımlılıklar değiştiğinde
// yan etkiler çalıştırmak için kullanılır.
// Burada müşterileri ilk kez yüklemek için kullanılıyor.

// useCallback:
// Fonksiyonların her render işleminde yeniden oluşturulmasını engeller.
// Özellikle başka callback'lerin dependency array'lerinde kullanılan
// fonksiyonların gereksiz yere yeniden oluşmasını önlemek için faydalıdır.
import { useCallback, useEffect, useState } from "react";

// Müşterilerle ilgili backend veya mock servis fonksiyonlarını içeri aktarıyoruz.
//
// Buradaki `as` kullanımı fonksiyonlara bu dosyada farklı isim vermemizi sağlar.
//
// Örneğin:
// customerService içindeki `createCustomer` fonksiyonu,
// bu dosyada `createCustomerRequest` adıyla kullanılacak.
//
// Bunun amacı aşağıda yazacağımız addCustomer, updateCustomer gibi
// hook fonksiyonlarıyla servis fonksiyonlarının birbirine karışmasını önlemektir.
import {
  createCustomer as createCustomerRequest,
  deleteCustomer as deleteCustomerRequest,
  getCustomers,
  updateCustomer as updateCustomerRequest,
} from "../services/customerService";

// Müşteri verilerini ve müşteri işlemlerini yöneten custom hook.
//
// Bu hook içerisinde:
// - Müşteriler yüklenir.
// - Loading durumu tutulur.
// - Hatalar yönetilir.
// - Müşteri eklenir.
// - Müşteri güncellenir.
// - Müşteri silinir.
//
// CustomersPage.jsx bu işlemlerin detayını bilmeden
// bu hook'un döndürdüğü değerleri ve fonksiyonları kullanır.
export default function useCustomers() {
  // Backend veya mock servisten gelen güncel müşteri listesini tutar.
  //
  // Başlangıçta müşteriler henüz yüklenmediği için boş array kullanılır.
  const [customers, setCustomers] = useState([]);

  // Müşteri listesinin şu anda yüklenip yüklenmediğini tutar.
  //
  // Başlangıç değeri true'dur çünkü component ilk açıldığında
  // müşteri verileri henüz servisten gelmemiştir.
  const [loading, setLoading] = useState(true);

  // Servis veya backend işlemlerinde oluşan hata mesajını tutar.
  //
  // Hata yoksa boş string olarak kalır.
  const [error, setError] = useState("");

  // Şu anda hangi ekleme, güncelleme veya silme işleminin devam ettiğini tutar.
  //
  // Alabileceği değerler:
  // ""         -> Devam eden işlem yok.
  // "create"   -> Yeni müşteri ekleniyor.
  // "update"   -> Müşteri güncelleniyor.
  // "delete"   -> Müşteri siliniyor.
  //
  // CustomersPage bu değeri kullanarak ilgili modalın
  // butonlarını disabled yapar ve loading yazısı gösterir.
  const [pendingAction, setPendingAction] = useState("");

  // Müşteri listesini servis üzerinden yeniden yükleyen fonksiyon.
  //
  // Bu fonksiyon özellikle bir hata sonrasında kullanıcının
  // "Tekrar dene" butonuna basmasıyla çalıştırılır.
  //
  // useCallback kullanıldığı için fonksiyon her render işleminde
  // gereksiz yere yeniden oluşturulmaz.
  const loadCustomers = useCallback(async () => {
    // Yeni bir yükleme işleminin başladığını belirtir.
    setLoading(true);

    // Önceden oluşmuş bir hata varsa temizler.
    //
    // Böylece kullanıcı tekrar denediğinde eski hata mesajı
    // ekranda kalmaya devam etmez.
    setError("");

    try {
      // customerService içerisindeki getCustomers fonksiyonunu çağırır.
      //
      // Backend bağlantısı varsa API isteği yapılır.
      // Backend bağlantısı yoksa servis mock müşteri verisi döndürebilir.
      const data = await getCustomers();

      // Servisten dönen müşteri listesini state'e kaydeder.
      //
      // customers state'i değiştiğinde bu hook'u kullanan component
      // yeniden render edilir ve tablo güncellenir.
      setCustomers(data);
    } catch (requestError) {
      // İstek başarısız olduğunda çalışır.
      //
      // Önce requestError.message içindeki gerçek hata mesajını kullanır.
      // Mesaj bulunmuyorsa varsayılan Türkçe hata mesajı gösterilir.
      setError(requestError.message || "Müşteriler yüklenemedi.");
    } finally {
      // İstek başarılı da olsa başarısız da olsa çalışır.
      //
      // Yükleme işleminin bittiğini belirtir.
      setLoading(false);
    }
  }, []);

  // Bu hook'u kullanan component ilk kez ekrana geldiğinde çalışır.
  //
  // Dependency array boş olduğu için bu effect yalnızca
  // component ilk açıldığında bir kez çalışır.
  useEffect(() => {
    // Componentin hâlâ ekranda olup olmadığını takip eder.
    //
    // Kullanıcı istek devam ederken başka bir sayfaya geçerse
    // component kapanabilir.
    //
    // Bu durumda artık kapanmış component üzerinde state güncellemesi
    // yapılmaması için active değişkeni kullanılır.
    let active = true;

    // Müşteri listesini servis üzerinden yükler.
    //
    // Burada async/await yerine Promise zinciri kullanılmıştır:
    //
    // .then()    -> İşlem başarılı olduğunda çalışır.
    // .catch()   -> İşlem hata verdiğinde çalışır.
    // .finally() -> İşlem başarılı veya başarısız tamamlandığında çalışır.
    getCustomers()
      .then((data) => {
        // Component hâlâ açıksa müşteri listesini state'e yazar.
        //
        // active false olmuşsa component kapanmıştır
        // ve state güncellenmez.
        if (active) setCustomers(data);
      })
      .catch((requestError) => {
        // Component hâlâ açıksa hata mesajını state'e yazar.
        if (active) setError(requestError.message || "Müşteriler yüklenemedi.");
      })
      .finally(() => {
        // Component hâlâ açıksa loading durumunu kapatır.
        if (active) setLoading(false);
      });

    // useEffect cleanup fonksiyonu.
    //
    // Component ekrandan kaldırıldığında çalışır.
    //
    // active false yapıldığı için yukarıdaki servis isteği
    // sonradan tamamlansa bile artık state güncellemesi yapılmaz.
    return () => {
      active = false;
    };
  }, []);

  // Create, update ve delete işlemlerinde tekrar eden ortak işlemleri yönetir.
  //
  // Her mutation işleminde:
  // - pendingAction ayarlanır.
  // - Eski hata temizlenir.
  // - Servis isteği çalıştırılır.
  // - Hata oluşursa error state'ine yazılır.
  // - İşlem sonunda pendingAction temizlenir.
  //
  // actionName:
  // "create", "update" veya "delete" değerlerinden biridir.
  //
  // request:
  // Çalıştırılacak async servis fonksiyonudur.
  const runMutation = useCallback(async (actionName, request) => {
    // Hangi işlemin başladığını state'e kaydeder.
    //
    // Örneğin actionName "create" ise
    // pendingAction değeri "create" olur.
    setPendingAction(actionName);

    // Önceden oluşmuş hata mesajını temizler.
    setError("");

    try {
      // Parametre olarak gönderilen servis fonksiyonunu çalıştırır.
      //
      // request bir fonksiyondur:
      // () => createCustomerRequest(input)
      //
      // await ile işlemin tamamlanması beklenir
      // ve servisten dönen sonuç dışarıya döndürülür.
      return await request();
    } catch (requestError) {
      // Servis işlemi başarısız olduğunda hata mesajını kaydeder.
      setError(requestError.message || "İşlem tamamlanamadı.");

      // Hatayı tekrar yukarıya fırlatır.
      //
      // Böylece CustomersPage içerisindeki handleAdd,
      // handleUpdate veya handleDelete fonksiyonları da
      // işlemin başarısız olduğunu anlayabilir.
      //
      // Bu sayede örneğin işlem başarısız olduğunda modal kapanmaz.
      throw requestError;
    } finally {
      // İşlem başarılı veya başarısız olsa da pendingAction temizlenir.
      //
      // Böylece işlem sırasında disabled olan butonlar
      // tekrar kullanılabilir hale gelir.
      setPendingAction("");
    }
  }, []);

  // Yeni müşteri eklemek için kullanılan fonksiyon.
  //
  // input parametresi CustomerForm içerisinden gelen
  // yeni müşteri bilgilerini içerir.
  const addCustomer = useCallback(
    async (input) => {
      // runMutation üzerinden create işlemi başlatılır.
      //
      // createCustomerRequest servis katmanındaki
      // gerçek müşteri ekleme fonksiyonudur.
      //
      // Servisten dönen yeni müşteri customer değişkenine kaydedilir.
      const customer = await runMutation("create", () => createCustomerRequest(input));

      // Yeni oluşturulan müşteriyi mevcut listenin en başına ekler.
      //
      // `current`, customers state'inin en güncel halidir.
      //
      // `[customer, ...current]`:
      // Yeni müşteriyi ilk sıraya koyar,
      // eski müşterileri arkasına ekler.
      setCustomers((current) => [customer, ...current]);

      // Yeni oluşturulan müşteri objesini CustomersPage'e döndürür.
      //
      // CustomersPage bu objeyi başarı mesajında
      // müşterinin adını göstermek için kullanır.
      return customer;
    },

    // addCustomer fonksiyonu runMutation kullandığı için
    // dependency array içerisinde runMutation bulunur.
    [runMutation],
  );

  // Var olan bir müşteriyi güncellemek için kullanılan fonksiyon.
  //
  // id:
  // Güncellenecek müşterinin benzersiz ID değeridir.
  //
  // input:
  // CustomerForm içerisinden gelen güncel müşteri bilgileridir.
  const updateCustomer = useCallback(
    async (id, input) => {
      // runMutation üzerinden update işlemi başlatılır.
      //
      // updateCustomerRequest fonksiyonuna:
      // - Müşterinin ID'si
      // - Güncellenmiş form bilgileri
      // gönderilir.
      //
      // Backend'den dönen güncel müşteri customer değişkenine kaydedilir.
      const customer = await runMutation("update", () => updateCustomerRequest(id, input));

      // Güncelleme backend tarafında başarılı olduktan sonra
      // local customers state'i de güncellenir.
      //
      // map bütün müşterileri tek tek gezer.
      //
      // item.id === id ise:
      // Güncellenmiş customer objesi kullanılır.
      //
      // ID eşleşmiyorsa:
      // Eski item değiştirilmeden korunur.
      setCustomers((current) => current.map((item) => (item.id === id ? customer : item)));

      // Güncellenmiş müşteri objesini CustomersPage'e döndürür.
      //
      // CustomersPage bunu başarı mesajında kullanabilir.
      return customer;
    },

    // updateCustomer fonksiyonu runMutation kullandığı için
    // dependency array içerisinde runMutation bulunur.
    [runMutation],
  );

  // Bir müşteriyi silmek için kullanılan fonksiyon.
  //
  // id:
  // Silinecek müşterinin benzersiz ID değeridir.
  const removeCustomer = useCallback(
    async (id) => {
      // Önce servis veya backend üzerindeki silme işlemi yapılır.
      //
      // await kullanıldığı için backend işlemi başarılı olmadan
      // müşteri local listeden kaldırılmaz.
      //
      // Böylece backend silme işlemi hata verirse
      // müşteri ekranda yanlışlıkla silinmiş görünmez.
      await runMutation("delete", () => deleteCustomerRequest(id));

      // Backend silme işlemi başarılı olduktan sonra
      // müşteri local state içerisinden kaldırılır.
      //
      // filter bütün müşterileri gezer.
      //
      // ID'si silinen müşteriye eşit olmayan müşterileri tutar.
      // Silinen müşteri yeni array'e dahil edilmez.
      setCustomers((current) => current.filter((customer) => customer.id !== id));
    },

    // removeCustomer fonksiyonu runMutation kullandığı için
    // dependency array içerisinde runMutation bulunur.
    [runMutation],
  );

  // Bu hook'u kullanan CustomersPage componentine
  // ihtiyaç duyduğu state değerlerini ve fonksiyonları döndürür.
  return {
    // Güncel müşteri listesi.
    customers,

    // Müşteri listesinin yüklenme durumu.
    loading,

    // Son oluşan servis veya backend hata mesajı.
    error,

    // Devam eden create, update veya delete işleminin adı.
    pendingAction,

    // loadCustomers fonksiyonunu dışarıya reload adıyla verir.
    //
    // CustomersPage içindeki "Tekrar dene" butonu
    // bu fonksiyonu kullanır.
    reload: loadCustomers,

    // Yeni müşteri ekleme fonksiyonu.
    addCustomer,

    // Mevcut müşteriyi güncelleme fonksiyonu.
    updateCustomer,

    // Müşteri silme fonksiyonu.
    removeCustomer,
  };
}
