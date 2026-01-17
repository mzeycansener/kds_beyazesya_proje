# KDS Beyaz Eşya Projesi

Bu proje, beyaz eşya ürünlerinin yönetimini ve sergilenmesini amaçlayan bir web uygulamasıdır. Node.js (Express.js) tabanlı bir API arka ucu ve MySQL veritabanı kullanılarak geliştirilmiştir.

## Özellikler

*   **Ürün Yönetimi:** Beyaz eşya ürünlerini ekleme, güncelleme, silme ve listeleme.
*   **Kullanıcı Arayüzü:** Basit ve anlaşılır bir kullanıcı arayüzü ile ürünleri keşfetme.
*   **Bölgeye Özel İçerik:** Şehirlere göre özelleştirilmiş ürün veya hizmet bilgileri (resimler aracılığıyla ipuçları).
*   **API Servisleri:** RESTful API aracılığıyla veritabanı etkileşimi.
*   **Hata Yönetimi:** Kapsamlı hata işleme ve yanıt mekanizmaları.

## İş Kuralları ve Senaryolar

Bu bölüm, uygulamanın temel iş kurallarını ve kullanım senaryolarını açıklamaktadır.

### Ürün Yönetimi Senaryoları

1.  **Yeni Ürün Ekleme:** Bir yönetici, beyaz eşya kataloğuna yeni bir ürün (buzdolabı, çamaşır makinesi vb.) ekleyebilir. Bu işlem, ürün adı, açıklaması, fiyatı, stok durumu ve ilgili görseller gibi bilgileri içerir.
    *   **İş Kuralı:** Tüm zorunlu alanlar (ürün adı, fiyat) doldurulmalıdır. Fiyat pozitif bir değer olmalıdır.
2.  **Ürün Bilgilerini Güncelleme:** Bir ürünün fiyatı değiştiğinde veya stok durumu güncellendiğinde, yönetici mevcut ürün bilgilerini değiştirebilir.
    *   **İş Kuralı:** Sadece mevcut ve geçerli bir ürün ID'si ile güncelleme yapılabilir. Stok değeri negatif olamaz.
3.  **Ürün Silme:** Artık satılmayan veya katalogdan kaldırılması gereken bir ürün, yönetici tarafından sistemden silinebilir.
    *   **İş Kuralı:** Silinen bir ürünün bilgileri veritabanından tamamen kaldırılır ve bir daha listelenmez.
4.  **Ürün Listeleme:** Kullanıcılar veya yöneticiler, tüm mevcut beyaz eşya ürünlerini veya belirli kriterlere göre filtrelenmiş ürünleri görüntüleyebilir.
    *   **İş Kuralı:** Listeleme işlemi, ürün adı, fiyat ve stok durumu gibi temel bilgileri sunar.

### Hata Yönetimi Senaryoları

1.  **Geçersiz İstek Verisi:** API'ye eksik veya hatalı parametrelerle istek gönderildiğinde (örn. ürün adı boş bırakılırsa), sistem kullanıcıya anlaşılır bir hata mesajı döner.
    *   **İş Kuralı:** Geçersiz isteklerde `400 Bad Request` HTTP durumu ve hatanın nedenini açıklayan bir JSON yanıtı döndürülür.
2.  **Bulunamayan Kaynak:** Var olmayan bir ürün ID'si ile sorgu yapıldığında (örn. `GET /api/products/999` ve 999 ID'li ürün yoksa), sistem uygun bir hata mesajı döner.
    *   **İş Kuralı:** Bulunamayan kaynaklar için `404 Not Found` HTTP durumu ve bilgi verici bir hata mesajı döndürülür.
3.  **Sunucu Hatası:** Uygulama içinde beklenmedik bir hata oluştuğunda (örn. veritabanı bağlantı sorunları), sistem hatayı loglar ve kullanıcıya genel bir hata mesajı sunar.
    *   **İş Kuralı:** İç sunucu hataları için `500 Internal Server Error` HTTP durumu ve güvenlik nedeniyle genel bir hata mesajı döndürülür (detaylı hata loglara yazılır).

### Stratejik Karar Senaryoları

1.  **Bayi Açma/Kapatma Kararı:** Bir şehrin Coğrafi Bilgi Sistemleri (CBS) analizi sonuçları, o bölgedeki pazar potansiyeli ve rekabet durumu hakkında önemli veriler sağlar.
    *   **İş Kuralı:** CBS analizi sonucunda pazar potansiyeli "yüksek" ve rekabet "düşük" olarak belirlenen şehirlere yeni bayi açılması için öncelik verilir. Potansiyeli "düşük" veya rekabeti "yüksek" olan şehirlere bayi açma kararı tekrar değerlendirilir veya ertelenir.
2.  **Kargo Gönderim Yöntemi Seçimi:** Beyaz eşya ürünlerinin müşterilere ulaştırılmasında maliyet, teslimat süresi ve ürün güvenliği önemli faktörlerdir.
    *   **İş Kuralı:** Ürün tipi (örn. hassaslık), gönderim mesafesi ve maliyet hedefleri dikkate alınarak en uygun taşıma yöntemi seçilir. Örneğin, uzun mesafeli ve büyük hacimli gönderiler için demiryolu veya denizyolu daha ekonomik olabilirken, kısa mesafeli veya acil gönderiler için karayolu tercih edilebilir. Sistem, bu kurallara göre en uygun yöntemi otomatik olarak önerir veya uygular.

## Teknolojiler

*   **Arka Uç:** Node.js, Express.js
*   **Veritabanı:** MySQL
*   **Ön Uç:** HTML, CSS, JavaScript
*   **Paket Yönetimi:** npm

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  Projeyi klonlayın:
    ```bash
    git clone https://github.com/KullaniciAdiniz/kds_beyazesya_proje.git
    cd kds_beyazesya_proje
    ```

2.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

3.  Veritabanı Ayarları:
    *   Bir MySQL veritabanı oluşturun.
    *   `config/db.js` veya `database/db.js` dosyalarınıza veritabanı bağlantı bilgilerinizi (kullanıcı adı, şifre, veritabanı adı) girin. Örnek:
        ```javascript
        // database/db.js veya config/db.js
        const mysql = require('mysql');

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'your_username',
            password: 'your_password',
            database: 'your_database_name'
        });

        connection.connect((err) => {
            if (err) {
                console.error('MySQL bağlantı hatası:', err);
                return;
            }
            console.log('MySQL veritabanına başarıyla bağlandı.');
        });

        module.exports = connection;
        ```

4.  Ortam değişkenlerini ayarlayın (gerekirse):
    `.env` dosyasını projenin kök dizinine kopyalayın ve gerekli ortam değişkenlerini yapılandırın. (Örneğin, `PORT` veya veritabanı kimlik bilgileri.)

5.  Uygulamayı başlatın:
    ```bash
    npm start
    ```
    veya
    ```bash
    node app.js
    ```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## API Endpoints (Örnek)

*   `GET /api/products`: Tüm ürünleri listeler.
*   `GET /api/products/:id`: Belirli bir ürünü getirir.
*   `POST /api/products`: Yeni bir ürün ekler.
*   `PUT /api/products/:id`: Bir ürünü günceller.
*   `DELETE /api/products/:id`: Bir ürünü siler.

Detaylı endpoint bilgileri için `routers/routes.js` ve `controllers/controller.js` dosyalarına bakınız.

## Dizin Yapısı

```
.
├── app.js                 # Ana uygulama dosyası
├── package.json           # Proje bağımlılıkları
├── config/                # Yapılandırma dosyaları (örn. db bağlantısı)
├── controllers/           # API mantığını içeren denetleyiciler
├── database/              # Veritabanı bağlantı ve işlemleri
├── middlewares/           # Express ara yazılımları (örn. hata yönetimi)
├── public/                # Statik dosyalar (HTML, CSS, JS, görseller)
├── routers/               # API rotaları
└── utils/                 # Yardımcı fonksiyonlar ve araçlar
```

## Katkıda Bulunma

Katkıda bulunmak isterseniz lütfen bir "pull request" açmadan önce değişikliklerinizi açıklayan bir "issue" oluşturunuz.

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakınız.
