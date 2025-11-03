import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/images/hero-image.jpg";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [preferencias, setPreferencias] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const normalizeEmail = (e) => (e || "").trim().toLowerCase();

    let loggedInUser = null;
    try {
      loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    } catch (e) {
      loggedInUser = null;
    }

    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const normalizedEmail = normalizeEmail(loggedInUser.email);
    const userIndex = users.findIndex((u) => normalizeEmail(u.email) === normalizedEmail);

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

    loggedInUser.email = normalizedEmail;

    if (loggedInUser.fechaNacimiento && typeof loggedInUser.edad !== "number") {
      loggedInUser.edad = calcularEdad(loggedInUser.fechaNacimiento);
    }
    if (typeof loggedInUser.isDuoc !== "boolean") {
      loggedInUser.isDuoc = /@duocuc\.cl$/i.test(normalizedEmail);
    }
    if (typeof loggedInUser.hasFelices50 !== "boolean") {
      loggedInUser.hasFelices50 = !!loggedInUser.hasFelices50;
    }

    if (userIndex > -1) {
      users[userIndex] = { ...users[userIndex], ...loggedInUser };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    }

    setUser(loggedInUser);
    setName(loggedInUser.name);
    setFechaNacimiento(loggedInUser.fechaNacimiento || "");
    setPreferencias(loggedInUser.preferencias || "");
  }, [navigate]);

  const validar = () => {
    if (!name) return "El nombre es obligatorio";
    if (password && password.length < 6)
      return "La nueva contraseña debe tener al menos 6 caracteres";
    if (password && password !== confirmPassword)
      return "Las nuevas contraseñas no coinciden";
    return "";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setExito("");
    const validationError = validar();
    if (validationError) {
      setError(validationError);
      return;
    }

    setCargando(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((u) => u.email === user.email);

      if (userIndex > -1) {
        const updatedUser = {
          ...users[userIndex],
          name: name,
          password: password ? password : users[userIndex].password,
          fechaNacimiento: fechaNacimiento || users[userIndex].fechaNacimiento,
          preferencias: preferencias || users[userIndex].preferencias,
        };

        users[userIndex] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setExito("¡Perfil actualizado con éxito!");
      } else {
        setError("No se pudo encontrar el usuario para actualizar.");
      }

      setCargando(false);
      setPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  if (!user) {
    return null;
  }

  return (
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
              value={user.email}
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
            />
          </div>

          <div className="text-sm text-cafe-oscuro/80">
            <p>Edad: {user.edad ?? "No registrada"}</p>
            <p>
              Beneficio DUOC: {user.isDuoc ? "Sí (torta gratis en tu cumpleaños)" : "No"}
            </p>
            <p>Cupon FELICES50 aplicado: {user.hasFelices50 ? "Sí" : "No"}</p>
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
            />
          </div>

          <button
            type="submit"
            className="w-full text-cafe-oscuro rounded-2xl px-4 py-2 border-1 border-cafe-oscuro hover:bg-cafe-oscuro hover:cursor-pointer hover:text-cafe-claro transition-all duration-200"
            disabled={cargando}
          >
            {cargando ? "Guardando Cambios..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </section>
  );
}
