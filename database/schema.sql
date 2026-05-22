-- =============================================
-- طلباتك مكانك - Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS talabatk_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE talabatk_db;

-- =============================================
-- 1. جدول المستخدمين (users)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(20) NOT NULL UNIQUE,
    email       VARCHAR(100) UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('admin','rider','customer','restaurant') NOT NULL DEFAULT 'customer',
    is_active   BOOLEAN DEFAULT TRUE,
    avatar      VARCHAR(255),
    fcm_token   VARCHAR(255),
    created_at  DATETIME DEFAULT NOW(),
    updated_at  DATETIME DEFAULT NOW() ON UPDATE NOW()
);

-- =============================================
-- 2. جدول المناديب (riders)
-- =============================================
CREATE TABLE IF NOT EXISTS riders (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    national_id     VARCHAR(20) UNIQUE,
    bike_plate      VARCHAR(20),
    area            VARCHAR(100),
    status          ENUM('online','offline','busy') DEFAULT 'offline',
    lat             DECIMAL(10,8),
    lng             DECIMAL(11,8),
    total_orders    INT DEFAULT 0,
    total_earnings  DECIMAL(10,2) DEFAULT 0.00,
    rating          DECIMAL(3,2) DEFAULT 5.00,
    rating_count    INT DEFAULT 0,
    created_at      DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 3. جدول العملاء (customers)
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    total_orders    INT DEFAULT 0,
    total_spent     DECIMAL(10,2) DEFAULT 0.00,
    wallet_balance  DECIMAL(10,2) DEFAULT 0.00,
    created_at      DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 4. جدول عناوين العملاء (customer_addresses)
-- =============================================
CREATE TABLE IF NOT EXISTS customer_addresses (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    label       VARCHAR(50),
    address     TEXT NOT NULL,
    lat         DECIMAL(10,8),
    lng         DECIMAL(11,8),
    is_default  BOOLEAN DEFAULT FALSE,
    created_at  DATETIME DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- =============================================
-- 5. جدول المطاعم والمتاجر (restaurants)
-- =============================================
CREATE TABLE IF NOT EXISTS restaurants (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    category        VARCHAR(100),
    phone           VARCHAR(20),
    address         TEXT,
    area            VARCHAR(100),
    lat             DECIMAL(10,8),
    lng             DECIMAL(11,8),
    logo            VARCHAR(255),
    cover_image     VARCHAR(255),
    is_open         BOOLEAN DEFAULT TRUE,
    min_order       DECIMAL(8,2) DEFAULT 0,
    delivery_fee    DECIMAL(8,2) DEFAULT 15.00,
    rating          DECIMAL(3,2) DEFAULT 5.00,
    rating_count    INT DEFAULT 0,
    total_orders    INT DEFAULT 0,
    total_revenue   DECIMAL(12,2) DEFAULT 0.00,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    created_at      DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 6. جدول منيو المطاعم (menu_items)
-- =============================================
CREATE TABLE IF NOT EXISTS menu_items (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id   INT NOT NULL,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    price           DECIMAL(8,2) NOT NULL,
    image           VARCHAR(255),
    category        VARCHAR(100),
    is_available    BOOLEAN DEFAULT TRUE,
    created_at      DATETIME DEFAULT NOW(),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- =============================================
-- 7. جدول الطلبات (orders)
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    order_number    VARCHAR(20) UNIQUE NOT NULL,
    customer_id     INT NOT NULL,
    restaurant_id   INT,
    rider_id        INT,
    pickup_address  TEXT NOT NULL,
    pickup_lat      DECIMAL(10,8),
    pickup_lng      DECIMAL(11,8),
    delivery_address TEXT NOT NULL,
    delivery_lat    DECIMAL(10,8),
    delivery_lng    DECIMAL(11,8),
    subtotal        DECIMAL(10,2) NOT NULL,
    delivery_fee    DECIMAL(8,2) DEFAULT 15.00,
    discount        DECIMAL(8,2) DEFAULT 0.00,
    total           DECIMAL(10,2) NOT NULL,
    status          ENUM('pending','accepted','picked_up','on_the_way','delivered','cancelled') DEFAULT 'pending',
    accepted_at     DATETIME,
    picked_up_at    DATETIME,
    delivered_at    DATETIME,
    cancelled_at    DATETIME,
    cancel_reason   TEXT,
    notes           TEXT,
    payment_method  ENUM('cash','wallet','online') DEFAULT 'cash',
    payment_status  ENUM('pending','paid','refunded') DEFAULT 'pending',
    created_at      DATETIME DEFAULT NOW(),
    updated_at      DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (rider_id) REFERENCES riders(id)
);

-- =============================================
-- 8. جدول عناصر الطلب (order_items)
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT NOT NULL,
    menu_item_id    INT,
    name            VARCHAR(150) NOT NULL,
    quantity        INT NOT NULL DEFAULT 1,
    unit_price      DECIMAL(8,2) NOT NULL,
    total_price     DECIMAL(8,2) NOT NULL,
    notes           TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- =============================================
-- 9. جدول المدفوعات (payments)
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    method          ENUM('cash','wallet','online') NOT NULL,
    status          ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
    transaction_id  VARCHAR(100),
    notes           TEXT,
    created_at      DATETIME DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- =============================================
-- 10. جدول أرباح المناديب (rider_earnings)
-- =============================================
CREATE TABLE IF NOT EXISTS rider_earnings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    rider_id    INT NOT NULL,
    order_id    INT NOT NULL,
    amount      DECIMAL(8,2) NOT NULL,
    status      ENUM('pending','paid') DEFAULT 'pending',
    paid_at     DATETIME,
    created_at  DATETIME DEFAULT NOW(),
    FOREIGN KEY (rider_id) REFERENCES riders(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- =============================================
-- 11. جدول الإشعارات (notifications)
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    title       VARCHAR(200) NOT NULL,
    body        TEXT NOT NULL,
    type        ENUM('order','payment','system','promo') DEFAULT 'order',
    is_read     BOOLEAN DEFAULT FALSE,
    data        JSON,
    created_at  DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 12. جدول التقييمات (ratings)
-- =============================================
CREATE TABLE IF NOT EXISTS ratings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    rider_id    INT,
    rider_rating    TINYINT CHECK (rider_rating BETWEEN 1 AND 5),
    rider_comment   TEXT,
    created_at      DATETIME DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (rider_id) REFERENCES riders(id)
);

-- =============================================
-- 13. جدول سجل النشاط (activity_logs)
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    action      VARCHAR(200) NOT NULL,
    entity_type VARCHAR(50),
    entity_id   INT,
    details     JSON,
    ip_address  VARCHAR(45),
    created_at  DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =============================================
-- 14. جدول الإعدادات (settings)
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    `key`       VARCHAR(100) NOT NULL UNIQUE,
    value       TEXT NOT NULL,
    description TEXT,
    updated_at  DATETIME DEFAULT NOW() ON UPDATE NOW()
);

-- =============================================
-- INDEXES للأداء
-- =============================================
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_rider ON orders(rider_id);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_riders_status ON riders(status);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- =============================================
-- بيانات إعدادات افتراضية
-- =============================================
INSERT INTO settings (`key`, value, description) VALUES
('company_name', 'طلباتك مكانك', 'اسم الشركة'),
('whatsapp_number', '201015819017', 'رقم واتساب الشركة'),
('default_delivery_fee', '15', 'رسوم التوصيل الافتراضية بالجنيه'),
('max_delivery_distance', '15', 'أقصى مسافة توصيل بالكيلومتر'),
('rider_commission', '70', 'نسبة المندوب من رسوم التوصيل %'),
('app_commission', '30', 'نسبة الشركة من رسوم التوصيل %'),
('min_order_amount', '20', 'الحد الأدنى للطلب بالجنيه'),
('working_areas', 'البلينا,جرجا,أبو شوشة,القرى التابعة', 'مناطق التغطية');

-- =============================================
-- مستخدم أدمن افتراضي
-- =============================================
-- يتم إنشاء مستخدم الأدمن بواسطة سكريبت التهيئة `npm run seed`
