import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import hero from "../assets/images/hero-image.jpg";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [preferencias, setPreferencias] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cupon, setCupon] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarBeneficioDuoc, setMostrarBeneficioDuoc] = useState(false);

  // usar el contexto de autenticación
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const norm = (email || "").trim().toLowerCase();
    setMostrarBeneficioDuoc(/@duocuc\.cl$/i.test(norm));
  }, [email]);

  const validar = () => {
    if (!name) return "El nombre es obligatorio";
    if (!email) return "El email es obligatorio";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Email invalido.";
    if (!fechaNacimiento) return "La fecha de nacimiento es obligatoria";
    if (!password) return "La contraseña es obligatoria";
    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres";
    if (password !== confirmPassword) return "Las contraseñas no coinciden";
    return "";
  };

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

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validar();
    if (v) {
      setError(v);
      return;
    }
    setCargando(true);

    try {
      // preparar datos para el backend manteniendo tus funciones
      const normalizedEmail = (email || "").trim().toLowerCase();
      const edad = calcularEdad(fechaNacimiento);
      const isDuoc = /@duocuc\.cl$/i.test(normalizedEmail);
      const hasFelices50 = (cupon || "").trim().toUpperCase() === "FELICES50";

      // crear objeto de usuario para el backend
      const userData = {
        nombre: name, 
        apellido: "", 
        email: normalizedEmail,
        password: password,
        fechaNacimiento: fechaNacimiento,
        edad: edad,
        isDuoc: isDuoc,
        hasFelices50: hasFelices50,
        preferencias: preferencias || "",
        cupon: cupon || ""
      };

      // usar el servicio de registro JWT
      await register(userData);
      // La redirección se maneja automáticamente en el useEffect
      
    } catch (error) {
      //  manejar errores del backend
      setError(error.message || "Error al crear la cuenta");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section
      className="min-h-screen bg-cafe-claro flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative w-full max-w-lg mx-4 bg-cafe-claro text-cafe-oscuro rounded-3xl p-8 shadow-2xl border-1 border-cafe-oscuro">
        <h2 className="font-subtitulo text-4xl text-center mb-6">
          Crear Cuenta
        </h2>

        <form
          className="space-y-4"
          id="registro-form"
          onSubmit={onSubmit}
          noValidate
        >
          {error && (
            <div className="text-sm text-red-600 bg-red-100 p-3 pl-4 rounded-2xl">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Nombre
            </label>
            <input
              className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={cargando || authLoading} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={cargando || authLoading} 
            />
            <p
              id="duoc-benefit-message"
              className={`text-sm text-cafe-oscuro/70 mt-1 ${
                mostrarBeneficioDuoc ? "block" : "hidden"
              }`}
            >
              Conseguirás una torta gratis en tu cumpleaños
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="dob">
              Fecha de Nacimiento
            </label>
            <input
              className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
              type="date"
              id="dob"
              name="dob"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
              disabled={cargando || authLoading} 
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={cargando || authLoading} 
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="confirm-password"
            >
              Confirmar Contraseña
            </label>
            <input
              className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={cargando || authLoading} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="coupon">
              Código de Descuento (Opcional)
            </label>
            <input
              className="w-full bg-cafe-oscuro/5 placeholder-cafe-oscuro/60 border border-cafe-oscuro/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-oscuro"
              type="text"
              id="coupon"
              name="coupon"
              value={cupon}
              onChange={(e) => setCupon(e.target.value)}
              disabled={cargando || authLoading} 
            />
          </div>

          <button
            type="submit"
            className="w-full text-cafe-oscuro rounded-2xl px-4 py-2 border-1 border-cafe-oscuro hover:bg-cafe-oscuro hover:cursor-pointer hover:text-cafe-claro transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" // ← MEJORADO
            disabled={cargando || authLoading} 
          >
            {cargando || authLoading ? "Creando Cuenta..." : "Crear Cuenta"} {}
          </button>
        </form>

        <p className="text-center text-sm mt-6 border-t-1 border-cafe-oscuro pt-4">
          ¿Ya tienes una cuenta?{" "}
          <NavLink
            to="/login"
            className="text-cafe-oscuro underline font-medium"
          >
            Inicia Sesión
          </NavLink>
        </p>
      </div>
    </section>
  );
}