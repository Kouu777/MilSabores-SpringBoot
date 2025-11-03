import { useMemo, useState, useEffect } from "react";
import { productosPasteleria } from "../ProductosData";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Productos = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [user, setUser] = useState(null);
  const { addToCart, updateQuantity, cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUser(loggedInUser);
    } catch (error) {
      setUser(null);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(
        productosPasteleria
          .map((p) => p.categoria ?? p.category)
          .filter(Boolean)
      )
    );
    return cats;
  }, []);

  const productosFiltrados = useMemo(() => {
    if (selectedCategory === "Todos") return productosPasteleria;
    return productosPasteleria.filter(
      (p) => (p.categoria ?? p.category) === selectedCategory
    );
  }, [selectedCategory]);

  const handleAddToCart = (producto) => {
    if (!user) {
      navigate("/login");
    } else {
      addToCart(producto);
    }
  };

  return (
    <div className="bg-cafe-blanco min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-cafe-oscuro">
        <div className="flex items-center justify-between mb-12 pb-16 border-b-1 border-cafe-oscuro/30">
          <span className="font-subtitulo text-4xl md:text-4xl">
            {selectedCategory === "Todos"
              ? "Nuestros Productos"
              : selectedCategory}
          </span>
          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="categoria"
                className="font-texto text-base text-cafe-oscuro"
              >
                Categoría:
              </label>
              <div className="relative">
                <select
                  id="categoria"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="font-texto text-base border border-cafe-oscuro/30 rounded-xl px-4 py-2 bg-white/80 text-cafe-oscuro focus:outline-none focus:ring-2 focus:ring-cafe-oscuro/40 focus:border-cafe-oscuro appearance-none pr-12 cursor-pointer hover:bg-white hover:border-cafe-oscuro/50 transition-all duration-200"
                >
                  <option
                    className="bg-cafe-claro text-cafe-oscuro font-texto"
                    value="Todos"
                  >
                    Todos
                  </option>
                  {categories.map((cat) => (
                    <option
                      className="bg-cafe-claro text-cafe-oscuro font-texto"
                      key={cat}
                      value={cat}
                    >
                      {cat}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center p-4">
                  <svg
                    className="h-4 w-4 text-cafe-oscuro"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          )}
        </div>

        {selectedCategory === "Todos" ? (
          <div className="space-y-12 pt-4">
            {categories.map((cat) => {
              const grupo = productosPasteleria.filter(
                (p) => (p.categoria ?? p.category) === cat
              );
              if (!grupo.length) return null;
              return (
                <section
                  key={cat}
                  className="border-b-1 border-dashed border-cafe-oscuro/30 pb-20"
                >
                  <h3 className="font-subtitulo text-2xl md:text-3xl mb-4 pb-4">
                    {cat}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {grupo.map((producto) => (
                      <div
                        key={producto.id}
                        onClick={() => navigate(`/producto/${producto.id}`)}
                        className="bg-white rounded-lg overflow-hidden cursor-pointer border border-cafe-oscuro/20 hover:border-cafe-oscuro transition-all duration-300"
                      >
                        <img
                          src={producto.imagenUrl}
                          alt={producto.nombre}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-subtitulo mb-2 text-cafe-oscuro truncate">
                            {producto.nombre}
                          </h3>
                          <p className="text-sm text-cafe-oscuro/70 mb-3 line-clamp-2">
                            {producto.descripcion}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-cafe-oscuro">
                              ${producto.precio.toLocaleString("es-CL")}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(producto);
                              }}
                              className="px-4 pb-2 pt-1 text-center bg-cafe-oscuro text-cafe-claro rounded-xl hover:bg-cafe-claro hover:text-cafe-oscuro border border-transparent hover:border-cafe-oscuro transition-colors duration-300 hover:cursor-pointer"
                            >
                              Agregar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                onClick={() => navigate(`/producto/${producto.id}`)}
                className="bg-white rounded-lg overflow-hidden cursor-pointer border border-cafe-oscuro/20 hover:border-cafe-oscuro transition-all duration-300"
              >
                <img
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-subtitulo mb-2 text-cafe-oscuro truncate">
                    {producto.nombre}
                  </h3>
                  <p className="text-sm text-cafe-oscuro/70 mb-3 line-clamp-2">
                    {producto.descripcion}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-cafe-oscuro">
                      ${producto.precio.toLocaleString("es-CL")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(producto);
                      }}
                      className="px-4 pb-2 pt-1 text-center bg-cafe-oscuro text-cafe-claro rounded-xl hover:bg-cafe-claro hover:text-cafe-oscuro border border-transparent hover:border-cafe-oscuro transition-colors duration-300 hover:cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-4 right-4 bg-cafe-oscuro px-4 py-4 border-1 m-4 border-transparent rounded-full shadow-lg group
           hover:bg-cafe-claro hover:text-cafe-oscuro hover:border-cafe-oscuro hover:cursor-pointer
           transform-gpu transition-all duration-500 ease-in-out hover:scale-104
           ${
             showScrollButton
               ? "opacity-100 translate-y-0"
               : "opacity-0 translate-y-4 pointer-events-none"
           }`}
          aria-label="Volver arriba"
          title="Volver arriba"
          style={{ transformOrigin: "center" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white group-hover:text-cafe-oscuro"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Productos;
