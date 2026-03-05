-- Seed Data for Asset Management System

-- Insert Default Roles
INSERT INTO roles (name, description, is_system) VALUES
('User', 'Standard user with basic access', true),
('Technical Responsible', 'Responsible for technical maintenance and repairs', true),
('Administrative Responsible', 'Responsible for administrative tasks', true),
('Biomedical Responsible', 'Responsible for biomedical equipment maintenance', true),
('Information Systems Responsible', 'Responsible for IT and information systems', true),
('Manager', 'Department manager or deputy manager', true),
('Hospital Manager', 'General Manager, Deputy General Manager, etc.', true),
('Central Manager', 'Central directorate managers', true),
('Admin', 'System administrators with full access', true)
ON CONFLICT (name) DO NOTHING;

-- Insert Area Types
INSERT INTO area_types (name, category, is_system) VALUES
-- Klinik Alan
('Klinik Alan', 'Klinik Alan', true),
('Laboratuvar', 'Klinik Alan', true),
('Radyoloji Birimi', 'Klinik Alan', true),
-- İdari Alan
('İdari Alan', 'İdari Alan', true),
('Ofis', 'İdari Alan', true),
('Kirli Deposu', 'İdari Alan', true),
-- Teknik Alan
('Teknik Alan', 'Teknik Alan', true),
('Elektrik Mahal', 'Teknik Alan', true),
('Mekanik Mahal', 'Teknik Alan', true),
-- Destek Alan
('Destek Alan', 'Destek Alan', true),
('Non-medikal Depo', 'Destek Alan', true),
('Sarf Depo', 'Destek Alan', true),
-- Ortak Alan
('Ortak Alan', 'Ortak Alan', true),
('Mutfak', 'Ortak Alan', true),
('Dinlenme Alanı', 'Ortak Alan', true)
ON CONFLICT DO NOTHING;

-- Insert Asset Categories
INSERT INTO asset_categories (name, category_type, description, is_system) VALUES
-- Elektrik
('Elektrik', 'Elektrik', 'Electrical equipment and systems', true),
('Güç Kaynağı & Dağıtım', 'Elektrik', 'Power source and distribution systems', true),
('Trafo', 'Elektrik', 'Transformers', true),
('Ana Pano', 'Elektrik', 'Main electrical panels', true),
('Tali Pano', 'Elektrik', 'Sub electrical panels', true),
-- Yedek Güç
('Yedek Güç', 'Elektrik', 'Backup power systems', true),
('Jeneratör', 'Elektrik', 'Generators', true),
('ATS', 'Elektrik', 'Automatic Transfer Switch', true),
('Yakıt Sistemi', 'Elektrik', 'Fuel systems', true),
-- Mekanik
('Mekanik', 'Mekanik', 'Mechanical equipment and systems', true),
('Havalandırma', 'Mekanik', 'Ventilation systems', true),
('Filtre', 'Mekanik', 'Filters', true),
-- Medikal
('Medikal', 'Medikal', 'Medical equipment', true),
-- Bilgi Sistemleri
('Bilgi Sistemleri', 'Bilgi Sistemleri', 'IT and information systems equipment', true)
ON CONFLICT DO NOTHING;

-- Insert Measurement Units
INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Watt', 'W', 'Electrical', 'Small device power consumption', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Kilowatt', 'kW', 'Electrical', 'Generator, AC unit and large motor power', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Kilovolt-Amper', 'kVA', 'Electrical', 'Transformer and UPS capacities', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Amper', 'A', 'Electrical', 'Current intensity (panel and fuse capacities)', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Volt', 'V', 'Electrical', 'Operating voltage', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Kilogram', 'kg', 'Weight', 'Device weight or laundry capacity', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Ton', 't', 'Weight', 'Chiller groups or large construction materials', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Litre', 'L', 'Volume', 'Water tanks, fuel tanks or autoclave volumes', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Metrekup', 'm3', 'Volume', 'Air flow or large storage areas', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('BTU/h', 'BTU/h', 'Heating', 'AC and cooling capacity', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Kilokalori/Saat', 'kcal/h', 'Heating', 'Heating boiler and heater capacity', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Bar', 'bar', 'Pressure', 'Compressor, hydrophore and medical gas pressure', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Psi', 'psi', 'Pressure', 'Tire or sensitive gas pressures', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Gigabyte', 'GB', 'Digital', 'RAM and disk capacity', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Terabyte', 'TB', 'Digital', 'Server and camera recording storage capacity', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Gigahertz', 'GHz', 'Digital', 'Processor speed', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Megabit/Saniye', 'Mbps', 'Digital', 'Internet and network speed', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Megapiksel', 'MP', 'Digital', 'Camera resolution', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Joule', 'J', 'Medical', 'Defibrillator energy level', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Litre/Dakika', 'L/min', 'Medical', 'Oxygen and flow meter capacity', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Mililitre/Saat', 'ml/h', 'Medical', 'Infusion pump speed', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO measurement_units (name, symbol, unit_type, description, is_system) VALUES
('Miliamper-saniye', 'mAs', 'Medical', 'X-ray beam power', true)
ON CONFLICT (name) DO NOTHING;

-- Insert Energy Types
INSERT INTO energy_types (name, description, is_system) VALUES
('Elektrik', 'Electric energy', true),
('Doğalgaz', 'Natural gas', true),
('Fuel-oil', 'Fuel oil', true),
('LPG', 'LPG', true),
('Güneş Enerjisi', 'Solar energy', true),
('Rüzgar Enerjisi', 'Wind energy', true)
ON CONFLICT DO NOTHING;

-- Insert Authorized Departments
INSERT INTO authorized_departments (name, description, is_system) VALUES
('Teknik Hizmetler', 'Technical Services Department', true),
('Biyomedikal', 'Biomedical Department', true),
('İdari ve Destek Hizmetleri', 'Administrative and Support Services', true),
('Bilgi Sistemleri', 'Information Systems Department', true),
('Satınalma', 'Purchasing Department', true),
('Eczane', 'Pharmacy Department', true),
('Radyoloji', 'Radiology Department', true)
ON CONFLICT DO NOTHING;

-- Insert Maintenance Types
INSERT INTO maintenance_types (name, description, is_periodic, is_system) VALUES
('Periyodik Bakım', 'Regular scheduled maintenance', true, true),
('Önleyici Bakım', 'Preventive maintenance', true, true),
('Düzeltici Bakım', 'Corrective maintenance', false, true),
('Acil Bakım', 'Emergency maintenance', false, true),
('Yıllık Bakım', 'Annual maintenance', true, true),
('Aylık Bakım', 'Monthly maintenance', true, true),
('Haftalık Bakım', 'Weekly maintenance', true, true),
('Günlük Kontrol', 'Daily inspection', true, true)
ON CONFLICT DO NOTHING;

-- Insert System Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_system) VALUES
('system_name', 'Varlık Yönetim Sistemi', 'string', 'System name', true),
('company_name', 'Şirket Adı', 'string', 'Company name', true),
('default_language', 'tr', 'string', 'Default language', true),
('timezone', 'Europe/Istanbul', 'string', 'System timezone', true),
('date_format', 'DD.MM.YYYY', 'string', 'Date format', true),
('time_format', 'HH:mm', 'string', 'Time format', true),
('maintenance_reminder_days', '7', 'number', 'Days before maintenance reminder', true),
('fault_request_auto_assign', 'false', 'boolean', 'Auto assign fault requests', true),
('oracle_sync_enabled', 'true', 'boolean', 'Oracle user sync enabled', true),
('oracle_sync_interval', '3600', 'number', 'Oracle sync interval in seconds', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert Default Admin User (password: admin123 - should be changed in production)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (oracle_id, first_name, last_name, email, phone, unit, position, employee_id, password_hash, is_active) VALUES
('ADMIN001', 'System', 'Administrator', 'admin@assetmanagement.com', '+905555555555', 'IT', 'System Administrator', 'ADMIN001', '$2a$10$58cT7U0SX/MTGGF8IqChfOB6nfwDiFdclxn.lMteIlxBgLTVuXVL.', true)
ON CONFLICT (oracle_id) DO NOTHING;

-- Assign Admin role to default admin user
INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at)
SELECT u.id, r.id, u.id, CURRENT_TIMESTAMP
FROM users u, roles r
WHERE u.oracle_id = 'ADMIN001' AND r.name = 'Admin'
ON CONFLICT DO NOTHING;
