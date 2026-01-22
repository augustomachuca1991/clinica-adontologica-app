import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

const calculateAge = (isoDate) => {
  if (!isoDate) return null;
  const birthDate = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// AGREGAMOS VALORES POR DEFECTO: filters = {}, sortConfig = {}
export const usePatients = (filters = {}, sortConfig = { column: "name", direction: "asc" }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useAuth();

  const mapPatientData = useCallback((p) => {
    return {
      ...p,
      patientId: p.patient_id,
      dateOfBirth: p.date_of_birth,
      avatar: p.avatar || `https://ui-avatars.com/api/?format=svg&background=f1f5f9&color=475569&font-size=0.33&name=${encodeURIComponent(p.name)}`,
      age: calculateAge(p.date_of_birth),
      // Mapeo de los campos nuevos que agregaste al SQL
      bloodType: p.blood_type,
      maritalStatus: p.marital_status,
      emergencyContact: p.emergency_contact || {},
      zipCode: p.zip_code,
    };
  }, []);

  const getPatientById = useCallback(async (id) => {
    try {
      const { data, error } = await supabase.from("patients").select(`*, appointments(appointment_date, status)`).eq("id", id).single();

      if (error) throw error;
      return mapPatientData(data);
    } catch (err) {
      console.error("Error obteniendo paciente:", err.message);
      return null;
    }
  }, []);

  const fetchPatients = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from("patients").select(`*, appointments(appointment_date, status)`).eq("profile_id", user.id).order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = data.map((p) => {
        const nextApp = p.appointments?.filter((a) => new Date(a.appointment_date) > new Date()).sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))[0];

        return {
          ...p,
          patientId: p.patient_id,
          dateOfBirth: p.date_of_birth,
          avatar: p.avatar || `https://ui-avatars.com/api/?format=svg&background=f1f5f9&color=475569&font-size=0.33&name=${encodeURIComponent(p.name)}`,
          age: calculateAge(p.date_of_birth),
          avatarAlt: p.avatar_alt || `Perfil de ${p.name}`,
          nextAppointment: nextApp?.appointment_date || null,
          appointmentStatus: nextApp?.status || "none",
        };
      });

      setPatients(formatted);
    } catch (err) {
      console.error("Error cargando pacientes:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addPatient = async (formData) => {
    try {
      if (!user?.id) throw new Error("No hay un usuario autenticado.");

      let finalTags = [];
      if (typeof formData.tags === "string" && formData.tags.length > 0) {
        finalTags = formData.tags.split(",").map((t) => t.trim());
      } else if (Array.isArray(formData.tags)) {
        finalTags = formData.tags;
      }

      const { data, error } = await supabase
        .from("patients")
        .insert([
          {
            name: formData.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}`,
            avatar_alt: "Patient avatar",
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.dateOfBirth,
            insurance: formData.insurance,
            status: "active",
            tags: finalTags,
            profile_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      setPatients((prev) => [data[0], ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // AGREGAMOS LA FUNCIÓN DE UPDATE QUE NECESITABAS
  const updatePatient = async (id, formData) => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          status: formData.status,
          gender: formData.gender,
          blood_type: formData.bloodType,
          marital_status: formData.maritalStatus,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          emergency_contact: formData.emergencyContact,
          allergies: formData.allergies,
          insurance: formData.insurance,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      // Refrescamos la lista localmente
      fetchPatients();
      return { success: true, data: data[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchPatients();
  }, [isLoggedIn, fetchPatients]);

  const filteredPatients = useMemo(() => {
    let result = [...patients];
    // USAMOS ENCADENAMIENTO OPCIONAL (?.) PARA EVITAR EL ERROR
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(q) || p.patientId?.toLowerCase().includes(q));
    }
    // AQUÍ ESTABA EL ERROR: agregamos el check de filters?.status
    if (filters?.status && filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }
    return result;
  }, [filters, patients]);

  const sortedPatients = useMemo(() => {
    const sorted = [...filteredPatients];
    // EVITAMOS QUE SE ROMPA SI NO HAY CONFIG DE ORDEN
    if (!sortConfig?.column) return sorted;

    sorted.sort((a, b) => {
      let aVal = a[sortConfig.column];
      let bVal = b[sortConfig.column];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredPatients, sortConfig]);

  return { sortedPatients, loading, refresh: fetchPatients, addPatient, updatePatient, getPatientById };
};
