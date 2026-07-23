-- ==========================================
-- AuraStock Oracle Database Initialization
-- ==========================================

-- 1. Create USERS table
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    role VARCHAR2(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active NUMBER(1) DEFAULT 1
);

CREATE SEQUENCE user_id_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_users_id
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT user_id_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/

-- 2. Create PRODUCTS table
CREATE TABLE products (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(150) NOT NULL,
    description VARCHAR2(500),
    price NUMBER(10, 2) NOT NULL,
    stock NUMBER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE SEQUENCE product_id_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_products_id
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT product_id_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/

-- Trigger to automatically update "updated_at" on PRODUCTS
CREATE OR REPLACE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- 3. Create INVENTORY_TRANSACTIONS table 
-- (to track stock in and out movements)
CREATE TABLE inventory_transactions (
    id NUMBER PRIMARY KEY,
    product_id NUMBER NOT NULL,
    user_id NUMBER,
    transaction_type VARCHAR2(20) NOT NULL, -- e.g., 'IN', 'OUT'
    quantity NUMBER NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR2(255),
    CONSTRAINT fk_inv_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_inv_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE SEQUENCE inventory_txn_id_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_inventory_txn_id
BEFORE INSERT ON inventory_transactions
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT inventory_txn_id_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/
