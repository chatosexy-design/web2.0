import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../config/supabase';
import { Roles } from '../types/roles';

const normalizeRole = (role?: string) => {
  const upper = String(role || '').toUpperCase();
  if (upper === Roles.ADMIN) return Roles.ADMIN;
  if (upper === Roles.CAFETERIA) return Roles.CAFETERIA;
  return Roles.STUDENT;
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { 
    firstName, lastName, semester, email, specialty, shift, password,
    age, weight, height, sex, activityLevel, goal 
  } = req.body;

  try {
    if (!firstName || !lastName || !semester || !email || !specialty || !shift || !password) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos básicos del alumno son obligatorios'
      });
    }
    const fullName = `${firstName} ${lastName}`.trim();

    // 1. Crear usuario en Supabase Auth usando el cliente ADMIN
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: Roles.STUDENT.toLowerCase()
      }
    });

    if (authError) return res.status(400).json({ success: false, error: authError.message });
    if (!authData.user) return res.status(400).json({ success: false, error: 'Error al crear usuario' });

    const userId = authData.user.id;

    // 2. Crear perfil en la tabla profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([
        { id: userId, email: email.toLowerCase().trim(), name: fullName, role: Roles.STUDENT.toLowerCase() }
      ]);

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return res.status(400).json({ success: false, error: "Error al crear perfil: " + profileError.message });
    }

    // 3. Crear registro en la tabla students con datos antropométricos
    const { data: studentData, error: studentError } = await supabaseAdmin
      .from('students')
      .upsert([
        { 
          user_id: userId, 
          first_name: firstName.trim(), 
          last_name: lastName.trim(), 
          email: email.toLowerCase().trim(),
          semester: String(semester).trim(),
          specialty: specialty.trim(),
          shift: shift.trim(),
          age: age || 17,
          weight: weight || 65,
          height: height || 183,
          sex: sex || 'Otro',
          activity_level: activityLevel || 'moderado',
          goal: goal || 'mantener'
        }
      ], { onConflict: 'user_id' })
      .select()
      .single();

    if (studentError) {
      return res.status(400).json({ success: false, error: "Error al crear datos de estudiante: " + studentError.message });
    }

    const token = jwt.sign(
      { id: userId, role: Roles.STUDENT, studentId: studentData.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito.',
      token,
      user: { id: userId, email, role: Roles.STUDENT, name: fullName, studentId: studentData.id },
      student: studentData
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // 1. Iniciar sesión con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password,
    });

    if (authError) return res.status(401).json({ success: false, error: 'Credenciales inválidas' });

    const userId = authData.user.id;

    // 2. Obtener perfil y datos de estudiante
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) return res.status(404).json({ success: false, error: 'Perfil no encontrado' });

    // 3. Generar código parental si no existe (usando supabaseAdmin para actualizar)
    let currentStudent = student;
    if (currentStudent && !currentStudent.parent_access_code) {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: updatedStudent, error: updateError } = await supabaseAdmin
        .from('students')
        .update({ parent_access_code: newCode })
        .eq('id', currentStudent.id)
        .select()
        .single();
      
      if (!updateError) currentStudent = updatedStudent;
    }

    const token = jwt.sign(
      { id: userId, role: normalizeRole(profile.role), studentId: currentStudent?.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { ...profile, role: normalizeRole(profile.role), student: currentStudent, studentId: currentStudent?.id },
      student: currentStudent
    });
  } catch (error) {
    next(error);
  }
};
