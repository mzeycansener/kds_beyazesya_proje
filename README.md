# KDS Beyaz Eşya Yönetim Sistemi

Bu proje, bir beyaz eşya distribütörünün bayi, ürün, stok ve satış yönetimi için geliştirilmiş bir Node.js tabanlı backend sistemidir. Sistem, Katı MVC (Model-View-Controller) mimarisine uygun olarak yapılandırılmıştır.

## Kurulum

1.  **Repository'yi Klonlayın:**
    ```bash
    git clone <repository-url>
    cd kds_beyazesya-main
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Veritabanını Kurun:**
    *   Bir MySQL veritabanı oluşturun.
    *   `setup.sql` dosyasını bu veritabanına import edin. Bu, gerekli tabloları ve başlangıç verilerini oluşturacaktır.

4.  **.env Dosyasını Yapılandırın:**
    Proje ana dizininde `.env` adında bir dosya oluşturun ve veritabanı bağlantı bilgilerinizi aşağıdaki gibi doldurun:
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=kds_beyazesya
    PORT=3000
    ```

5.  **Uygulamayı Başlatın:**
    ```bash
    node app.js
    ```
    Sunucu varsayılan olarak 3000 portunda çalışmaya başlayacaktır.

## API Endpointleri

Tüm endpoint'ler `/api` ana yolu altındadır.

*   `GET /products`: Tüm satış ve lansman ürünlerini listeler.
*   `POST /products`: Yeni bir ürün ekler.
*   `GET /dealers`: Tüm bayileri listeler.
*   `GET /cities`: Tüm şehirleri listeler.
*   `POST /register`: Yeni bir kullanıcı kaydı oluşturur.
*   `POST /login`: Kullanıcı girişi yapar.
*   `POST /sales`: Bir satış işlemi gerçekleştirir.

## Özel İş Senaryoları

Bu projede, backend mantığını göstermek için iki özel senaryo bulunmaktadır:

### 1. Stok Kontrolü (`/api/sales`)

Bir satış işlemi (`POST /api/sales`) gerçekleştirilirken sistem, istenen ürün adedinin veritabanındaki mevcut stoktan fazla olup olmadığını kontrol eder.

*   **Başarılı Durum:** Eğer `istenen_adet <= stok` ise, satış işlemi kaydedilir ve `satis_urunleri` tablosundaki ilgili ürünün `stok_adedi` güncellenir.
*   **Hata Durumu:** Eğer `istenen_adet > stok` ise, sistem işlemi iptal eder ve `400 Bad Request` status kodu ile birlikte yetersiz stok olduğunu belirten bir hata mesajı döner. Bu işlem, database transaction mekanizması ile güvence altına alınmıştır; yani stok güncellemesi veya satış kaydı sırasında bir hata olursa tüm işlem geri alınır.

### 2. Mükerrer Kayıt Kontrolü (`/api/register`)

Yeni bir kullanıcı kaydı (`POST /api/register`) oluşturulurken sistem, istekte gönderilen e-posta adresinin `users` tablosunda zaten mevcut olup olmadığını kontrol eder.

*   **Başarılı Durum:** Eğer e-posta adresi daha önce kaydedilmemişse, yeni kullanıcı oluşturulur.
*   **Hata Durumu:** Eğer e-posta adresi zaten mevcutsa, sistem `409 Conflict` status kodu ile birlikte bu e-postanın zaten kullanıldığını belirten bir hata mesajı döner.