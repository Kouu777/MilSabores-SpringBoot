import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import ProtectedRoute from "../components/ProtectedRoute"; 
import hero from "../assets/images/hero-image.jpg";

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [preferencias, setPreferencias] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  // usar el contexto de autenticación
  const { user: authUser, updateProfile, isAuthenticated } = useAuth();

  useEffect(() => {
    // usar datos del contexto en lugar de localStorage
    if (!isAuthenticated || !authUser) {
      return;
    }

    // lógica de cálculo de edad y beneficios
    const calcularEdad = (fechaStr) => {
      if (!fechaStr) return null;
      const nacimiento = new Date(fechaStr);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return edad;
    };

    //  usar datos del usuario con los campos personalizados
    const userData = {
      ...authUser,
      //  Asegurar que existan los campos
      fechaNacimiento: authUser.fechaNacimiento || "",
      preferencias: authUser.preferencias || "",
      edad: authUser.edad || (authUser.fechaNacimiento ? calcularEdad(authUser.fechaNacimiento) : null),
      isDuoc: authUser.isDuoc || /@duocuc\.cl$/i.test(authUser.email || ""),
      hasFelices50: authUser.hasFelices50 || false,
      name: authUser.nombre || authUser.name || "" 
    };

    setName(userData.name);
    setFechaNacimiento(userData.fechaNacimiento);
    setPreferencias(userData.preferencias);
  }, [authUser, isAuthenticated]);

  const validar = () => {
    if (!name) return "El nombre es obligatorio";
    if (password && password.length < 6)
      return "La nueva contraseña debe tener al menos 6 caracteres";
    if (password && password !== confirmPassword)
      return "Las nuevas contraseñas no coinciden";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");
    const validationError = validar();
    if (validationError) {
      setError(validationError);
      return;
    }

    setCargando(true);
    
    try {
      //  usar el servicio de actualización del backend
      const updatedData = {
        nombre: name,
        fechaNacimiento: fechaNacimiento,
        preferencias: preferencias,
        // solo enviar password si se cambió
        ...(password && { password: password })
      };

      await updateProfile(updatedData);
      setExito("¡Perfil actualizado con éxito!");
      
      // 
      setPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      setError(error.message || "Error al actualizar el perfil");
    } finally {
      setCargando(false);
    }
  };

  // usar ProtectedRoute para manejar la autenticación
  return (
    <ProtectedRoute>
      <section
        className="min-h-screen bg-cafe-claro flex items-center justify-center"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative w-full max-w-lg mx-4 bg-cafe-blanco text-cafe-oscuro rounded-3xl p-8 shadow-2xl border-1 border-cafe-oscuro">
          <h2 className="font-subtitulo text-4xl text-center mb-6">
            Modificar Perfil
          </h2>
          
          {}
          {authUser && (
            <form className="space-y-4" onSubmit={onSubmit} noValidate>
              {error && (
                <div className="text-sm text-red-600 bg-red-100 p-3 pl-4 rounded-2xl">
                  {error}
                </div>
              )}
              {exito && (
                <div className="text-sm text-green-600 bg-green-100 p-3 pl-4 rounded-2xl">
                  {exito}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Correo Electrónico
                </label>
                <input
                  className="w-full bg-cafe-oscuro/10 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2"
                  type="email"
                  id="email"
                  value={authUser.email}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="dob">
                  Fecha de Nacimiento
                </label>
                <input
                  className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
                  type="date"
                  id="dob"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  disabled={cargando} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="prefs">
                  Preferencias (ej. sabores favoritos)
                </label>
                <input
                  className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
                  type="text"
                  id="prefs"
                  value={preferencias}
                  onChange={(e) => setPreferencias(e.target.value)}
                  disabled={cargando}
                />
              </div>

              {}
              <div className="text-sm text-cafe-oscuro/80">
                <p>Edad: {authUser.edad ?? "No registrada"}</p>
                <p>
                  Beneficio DUOC: {authUser.isDuoc ? "Sí (torta gratis en tu cumpleaños)" : "No"}
                </p>
                <p>Cupón FELICES50 aplicado: {authUser.hasFelices50 ? "Sí" : "No"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Nombre
                </label>
                <input
                  className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={cargando} 
                />
              </div>

              <p className="text-sm text-cafe-oscuro/80 pt-2">
                Cambiar contraseña (dejar en blanco para no cambiar):
              </p>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="password"
                >
                  Nueva Contraseña
                </label>
                <input
                  className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={cargando} 
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="confirm-password"
                >
                  Confirmar Nueva Contraseña
                </label>
                <input
                  className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={cargando} 
                />
              </div>

              <button
                type="submit"
                className="w-full text-cafe-oscuro rounded-2xl px-4 py-2 border-1 border-cafe-oscuro hover:bg-cafe-oscuro hover:cursor-pointer hover:text-cafe-claro transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" // ← MEJORADO
                disabled={cargando}
              >
                {cargando ? "Guardando Cambios..." : "Guardar Cambios"}
              </button>
            </form>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}