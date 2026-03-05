-- Database Schema for Asset Management and Contractor Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oracle_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    unit VARCHAR(255),
    position VARCHAR(255),
    employee_id VARCHAR(50),
    profile_photo TEXT,
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    facility_type VARCHAR(100) NOT NULL, -- Hastane, Depo, İdari Ofis, Çağrı Merkezi, Tıp Merkezi, Diyaliz Merkezi, Konuk Evi
    
    -- Contact Information
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Legal Information
    trade_name VARCHAR(255),
    sgk_registration_number VARCHAR(50),
    nace_code VARCHAR(50),
    workplace_hazard_class VARCHAR(50), -- Çok Tehlikeli, Tehlikeli, Az Tehlikeli
    
    -- Facility Information
    block_count INTEGER DEFAULT 1,
    building_construction_year INTEGER,
    building_height DECIMAL(10, 2),
    structure_height DECIMAL(10, 2),
    floor_count INTEGER,
    closed_area DECIMAL(15, 2),
    closed_parking_area DECIMAL(15, 2),
    
    -- Other Information
    bed_count INTEGER,
    employee_count INTEGER,
    contractor_employee_count INTEGER,
    facility_manager_id UUID REFERENCES users(id),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Roles Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id, facility_id)
);

-- Facility Blocks Table
CREATE TABLE IF NOT EXISTS facility_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    block_name VARCHAR(100) NOT NULL,
    block_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Area Types Table
CREATE TABLE IF NOT EXISTS area_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Klinik Alan, İdari Alan, Teknik Alan, Destek Alan, Ortak Alan
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Areas (Mahal) Table
CREATE TABLE IF NOT EXISTS areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    block_id UUID REFERENCES facility_blocks(id) ON DELETE CASCADE,
    area_type_id UUID REFERENCES area_types(id),
    floor_number INTEGER,
    area_name VARCHAR(255) NOT NULL,
    area_code VARCHAR(50),
    area_size DECIMAL(15, 2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Categories Table
CREATE TABLE IF NOT EXISTS asset_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES asset_categories(id),
    category_type VARCHAR(100), -- Elektrik, Mekanik, Medikal, Bilgi Sistemleri, vb.
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Measurement Units Table
CREATE TABLE IF NOT EXISTS measurement_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    unit_type VARCHAR(100) NOT NULL, -- Electrical, Weight, Volume, Heating, Digital, Medical
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy Types Table
CREATE TABLE IF NOT EXISTS energy_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authorized Departments Table
CREATE TABLE IF NOT EXISTS authorized_departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contractors Table
CREATE TABLE IF NOT EXISTS contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_code VARCHAR(50) UNIQUE,
    
    -- Contact Information
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    
    -- Legal Information
    tax_number VARCHAR(50),
    tax_office VARCHAR(100),
    trade_registration_number VARCHAR(50),
    
    -- Company Details
    company_type VARCHAR(100),
    specialization VARCHAR(255),
    employee_count INTEGER,
    
    -- Contract Information
    contract_start_date DATE,
    contract_end_date DATE,
    contract_value DECIMAL(15, 2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, terminated
    
    -- Additional Info
    documents JSONB,
    certifications JSONB,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contractor Facility Assignments Table
CREATE TABLE IF NOT EXISTS contractor_facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    services JSONB,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(contractor_id, facility_id)
);

-- Contractor Employees Table
CREATE TABLE IF NOT EXISTS contractor_employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES facilities(id),
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    position VARCHAR(255),
    employee_id VARCHAR(50),
    
    specialization VARCHAR(255),
    certifications JSONB,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets Table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    category_id UUID REFERENCES asset_categories(id),
    area_id UUID REFERENCES areas(id),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    
    -- Technical Specifications
    brand VARCHAR(255),
    model VARCHAR(255),
    serial_number VARCHAR(100),
    purchase_date DATE,
    warranty_expiry_date DATE,
    installation_date DATE,
    
    -- Capacity/Measurement
    capacity_value DECIMAL(15, 2),
    capacity_unit_id UUID REFERENCES measurement_units(id),
    
    -- Energy
    energy_type_id UUID REFERENCES energy_types(id),
    power_consumption DECIMAL(15, 2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, maintenance, broken, retired
    condition VARCHAR(50), -- excellent, good, fair, poor
    
    -- Financial
    purchase_price DECIMAL(15, 2),
    current_value DECIMAL(15, 2),
    
    -- Responsibility
    responsible_department_id UUID REFERENCES authorized_departments(id),
    responsible_user_id UUID REFERENCES users(id),
    
    -- Additional Info
    manufacturer VARCHAR(255),
    supplier VARCHAR(255),
    technical_specs JSONB,
    documents JSONB,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Types Table
CREATE TABLE IF NOT EXISTS maintenance_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_periodic BOOLEAN DEFAULT false,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Plans Table
CREATE TABLE IF NOT EXISTS maintenance_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    maintenance_type_id UUID REFERENCES maintenance_types(id),
    plan_name VARCHAR(255) NOT NULL,
    description TEXT,
    frequency VARCHAR(50), -- daily, weekly, monthly, quarterly, yearly, custom
    frequency_value INTEGER,
    duration_hours DECIMAL(5, 2),
    priority VARCHAR(20), -- low, medium, high, critical
    start_date DATE,
    end_date DATE,
    responsible_user_id UUID REFERENCES users(id),
    responsible_department_id UUID REFERENCES authorized_departments(id),
    contractor_id UUID REFERENCES contractors(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Records Table
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_plan_id UUID REFERENCES maintenance_plans(id) ON DELETE SET NULL,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    maintenance_type_id UUID REFERENCES maintenance_types(id),
    
    scheduled_date DATE NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    
    performed_by UUID REFERENCES users(id),
    performed_by_contractor_id UUID REFERENCES contractors(id),
    
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    priority VARCHAR(20),
    
    description TEXT,
    work_performed TEXT,
    materials_used JSONB,
    cost DECIMAL(15, 2),
    
    findings TEXT,
    recommendations TEXT,
    
    next_maintenance_date DATE,
    
    attachments JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fault Requests Table
CREATE TABLE IF NOT EXISTS fault_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    asset_id UUID REFERENCES assets(id),
    area_id UUID REFERENCES areas(id),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    fault_type VARCHAR(100), -- electrical, mechanical, software, other
    severity VARCHAR(20), -- low, medium, high, critical
    
    requested_by UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    assigned_contractor_id UUID REFERENCES contractors(id),
    
    status VARCHAR(50) DEFAULT 'pending', -- pending, assigned, in_progress, completed, cancelled
    
    priority VARCHAR(20),
    
    estimated_cost DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2),
    
    resolution_notes TEXT,
    resolution_date TIMESTAMP,
    
    attachments JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fault Request Comments Table
CREATE TABLE IF NOT EXISTS fault_request_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fault_request_id UUID NOT NULL REFERENCES fault_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    comment TEXT NOT NULL,
    attachments JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(100), -- maintenance, fault_request, system, contractor
    
    related_id UUID,
    related_type VARCHAR(100),
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    priority VARCHAR(20), -- low, medium, high
    
    action_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    
    maintenance_reminders BOOLEAN DEFAULT true,
    fault_request_notifications BOOLEAN DEFAULT true,
    system_notifications BOOLEAN DEFAULT true,
    contractor_notifications BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_oracle_id ON users(oracle_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_facilities_name ON facilities(name);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(facility_type);
CREATE INDEX IF NOT EXISTS idx_areas_facility_id ON areas(facility_id);
CREATE INDEX IF NOT EXISTS idx_areas_area_type_id ON areas(area_type_id);
CREATE INDEX IF NOT EXISTS idx_assets_facility_id ON assets(facility_id);
CREATE INDEX IF NOT EXISTS idx_assets_category_id ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_area_id ON assets(area_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_plans_asset_id ON maintenance_plans(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_asset_id ON maintenance_records(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_status ON maintenance_records(status);
CREATE INDEX IF NOT EXISTS idx_fault_requests_facility_id ON fault_requests(facility_id);
CREATE INDEX IF NOT EXISTS idx_fault_requests_status ON fault_requests(status);
CREATE INDEX IF NOT EXISTS idx_fault_requests_requested_by ON fault_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON areas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_plans_updated_at BEFORE UPDATE ON maintenance_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_records_updated_at BEFORE UPDATE ON maintenance_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fault_requests_updated_at BEFORE UPDATE ON fault_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractor_employees_updated_at BEFORE UPDATE ON contractor_employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
