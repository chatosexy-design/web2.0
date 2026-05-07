-- Esquema de base de datos para ChatoSano en Supabase (PostgreSQL)

-- 1. Tabla de Usuarios (Extensión de auth.users si se usa Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'cafeteria')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tabla de Estudiantes
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    semester TEXT NOT NULL,
    specialty TEXT NOT NULL,
    shift TEXT NOT NULL,
    parent_access_code TEXT UNIQUE,
    age INTEGER DEFAULT 17,
    weight DECIMAL DEFAULT 65,
    height DECIMAL DEFAULT 183,
    sex TEXT DEFAULT 'Otro' CHECK (sex IN ('M', 'F', 'Otro')),
    activity_level TEXT DEFAULT 'moderado' CHECK (activity_level IN ('sedentario', 'ligero', 'moderado', 'activo', 'muy_activo')),
    goal TEXT DEFAULT 'mantener' CHECK (goal IN ('perder_peso', 'mantener', 'ganar_musculo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabla de Platillos (Cafetería)
CREATE TABLE IF NOT EXISTS dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    calories DECIMAL NOT NULL DEFAULT 0,
    protein DECIMAL NOT NULL DEFAULT 0,
    carbs DECIMAL NOT NULL DEFAULT 0,
    fat DECIMAL NOT NULL DEFAULT 0,
    sugar DECIMAL DEFAULT 0,
    sodium DECIMAL DEFAULT 0,
    fiber DECIMAL DEFAULT 0,
    traffic_light TEXT DEFAULT 'verde' CHECK (traffic_light IN ('verde', 'amarillo', 'rojo')),
    price DECIMAL NOT NULL DEFAULT 0,
    category TEXT DEFAULT 'General',
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabla de Registros de Alimentos (FoodLog)
CREATE TABLE IF NOT EXISTS food_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    dish_id UUID REFERENCES dishes(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    calories DECIMAL NOT NULL DEFAULT 0,
    protein DECIMAL NOT NULL DEFAULT 0,
    carbs DECIMAL NOT NULL DEFAULT 0,
    fat DECIMAL NOT NULL DEFAULT 0,
    sugar DECIMAL DEFAULT 0,
    sodium DECIMAL DEFAULT 0,
    fiber DECIMAL DEFAULT 0,
    meal_type TEXT DEFAULT 'refrigerio' CHECK (meal_type IN ('desayuno', 'almuerzo', 'cena', 'refrigerio')),
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (Ejemplo: Estudiantes solo ven sus propios datos)
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students can view their own student profile" ON students FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Everyone can view dishes" ON dishes FOR SELECT USING (true);
CREATE POLICY "Students can view their own food logs" ON food_logs FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);
