const router = require('express').Router();
const router = require('express').Router();
const {
    getProducts,
    addProduct,
    getDealers,
    getCities,
    register,
    login,
    makeSale
} = require('../controllers/controller');

router.get('/products', getProducts);
router.post('/products', addProduct);
router.get('/dealers', getDealers);
router.get('/cities', getCities);
router.post('/register', register);
router.post('/login', login);
router.post('/sales', makeSale);

module.exports = router;
