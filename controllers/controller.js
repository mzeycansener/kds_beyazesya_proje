const db = require('../db/mysql_connect'); // Still needed for transactions in makeSale for now
const APIError = require('../utils/errors');
const Response = require('../utils/response');

// Import Models
const User = require('../models/UserModel');
const Dealer = require('../models/DealerModel');
const City = require('../models/CityModel');
const Urun = require('../models/UrunModel');
const SaleProduct = require('../models/SaleProductModel');
const LaunchProduct = require('../models/LaunchProductModel');

const getProducts = async (req, res) => {
    try {
        const salesRows = await SaleProduct.getAll();
        const launchRows = await LaunchProduct.getAll();
        
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
        const newUrun = await Urun.create({ urun_adi, tur });
        new Response(newUrun, 'Ürün başarıyla eklendi.').success(res);
    } catch (error) {
        throw error;
    }
};

const getDealers = async (req, res) => {
    try {
        const dealers = await Dealer.getAll();
        const cities = await City.getAll();
        
        const dealersWithCities = dealers.map(dealer => {
            const city = cities.find(c => c.id === dealer.sehir_id);
            return {
                ...dealer,
                city: city ? city.sehir_adi : 'Bilinmiyor'
            };
        });
        new Response(dealersWithCities).success(res);
    } catch (error) {
        throw error;
    }
};

const getCities = async (req, res) => {
    try {
        const cities = await City.getAll();
        new Response(cities).success(res);
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

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw new APIError('Bu e-posta adresi zaten kullanılıyor.', 409);
        }

        // Note: In a real application, hash the password before saving it.
        const newUser = await User.create(email, password);
        new Response(newUser, 'Kullanıcı başarıyla oluşturuldu.').success(res);
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

        const user = await User.findByEmail(email);
        if (!user) {
            throw new APIError('Kullanıcı bulunamadı.', 404);
        }

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
        
        const currentStock = await SaleProduct.getStockForUpdate(urun_id, connection);

        if (currentStock === null) {
            throw new APIError('Satılacak ürün bulunamadı.', 404);
        }

        if (istenen_adet > currentStock) {
            throw new APIError(`Yetersiz stok. Mevcut stok: ${currentStock}`, 400);
        }

        const newStock = currentStock - istenen_adet;
        await SaleProduct.updateStock(urun_id, newStock, connection);
        
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
