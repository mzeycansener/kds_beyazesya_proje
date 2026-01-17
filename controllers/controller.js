const db = require('../db/mysql_connect');
const APIError = require('../utils/errors');
const Response = require('../utils/response');

const getProducts = async (req, res) => {
    try {
        const [salesRows] = await db.execute("SELECT *, 'Satis' as status FROM satis_urunleri");
        const [launchRows] = await db.execute("SELECT *, 'Lansman' as status FROM lansman_urunleri");
        
        new Response([...salesRows, ...launchRows]).success(res);
    } catch (error) {
        throw error;
    }
};

const addProduct = async (req, res) => {
    try {
        const { urun_adi, tur } = req.body;
        if (!urun_adi || !tur) {
            throw new APIError('Ürün adı ve türü zorunludur.', 400);
        }
        const [result] = await db.execute('INSERT INTO urunler (urun_adi, tur) VALUES (?, ?)', [urun_adi, tur]);
        new Response({ id: result.insertId, urun_adi, tur }, 'Ürün başarıyla eklendi.').success(res);
    } catch (error) {
        throw error;
    }
};

const getDealers = async (req, res) => {
    try {
        const sql = `
            SELECT d.id, d.bayi_adi, c.sehir_adi as city, d.satis_miktari, d.kar_miktari, d.durum 
            FROM bayiler d
            JOIN sehirler c ON d.sehir_id = c.id
        `;
        const [rows] = await db.execute(sql);
        new Response(rows).success(res);
    } catch (error) {
        throw error;
    }
};

const getCities = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM sehirler');
        new Response(rows).success(res);
    } catch (error) {
        throw error;
    }
};

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new APIError('E-posta ve şifre zorunludur.', 400);
        }

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            throw new APIError('Bu e-posta adresi zaten kullanılıyor.', 409);
        }

        // Note: In a real application, hash the password before saving it.
        const [result] = await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
        new Response({ id: result.insertId, email }, 'Kullanıcı başarıyla oluşturuldu.').success(res);
    } catch (error) {
        throw error;
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new APIError('E-posta ve şifre zorunludur.', 400);
        }

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            throw new APIError('Kullanıcı bulunamadı.', 404);
        }

        const user = users[0];
        // Note: In a real application, compare hashed passwords.
        if (user.password !== password) {
            throw new APIError('Geçersiz şifre.', 401);
        }

        new Response({ id: user.id, email: user.email }, 'Giriş başarılı.').success(res);
    } catch (error) {
        throw error;
    }
};

const makeSale = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { bayi_id, urun_id, istenen_adet } = req.body;
        if (!bayi_id || !urun_id || !istenen_adet) {
            throw new APIError('Bayi ID, Ürün ID ve istenen adet zorunludur.', 400);
        }
        
        const [productRows] = await connection.execute('SELECT stok_adedi FROM satis_urunleri WHERE id = ? FOR UPDATE', [urun_id]);

        if (productRows.length === 0) {
            throw new APIError('Satılacak ürün bulunamadı.', 404);
        }

        const currentStock = productRows[0].stok_adedi;
        if (istenen_adet > currentStock) {
            throw new APIError(`Yetersiz stok. Mevcut stok: ${currentStock}`, 400);
        }

        const newStock = currentStock - istenen_adet;
        await connection.execute('UPDATE satis_urunleri SET stok_adedi = ? WHERE id = ?', [newStock, urun_id]);
        
        // You would typically insert into a 'sales' table here.
        // For this example, we'll just log it.
        console.log(`Sale recorded: ${istenen_adet} of product ${urun_id} from dealer ${bayi_id}`);

        await connection.commit();
        
        new Response({ urun_id, kalan_stok: newStock }, 'Satış başarıyla gerçekleştirildi ve stok güncellendi.').success(res);

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};


module.exports = {
    getProducts,
    addProduct,
    getDealers,
    getCities,
    register,
    login,
    makeSale
};
