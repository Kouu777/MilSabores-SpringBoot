import { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productosPasteleria } from "../ProductosData";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const producto = useMemo(
    () => productosPasteleria.find((p) => p.id === id),
    [id]
  );

  const productosRelacionados = useMemo(() => {
    if (!producto) return [];
    return productosPasteleria
      .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
      .slice(0, 4);
  }, [producto]);

  if (!producto)
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-claro">
        <div className="p-8 bg-white rounded-2xl shadow-lg">
          Producto no encontrado
        </div>
      </div>
    );

  const defaultIngredients = () => {
    const cat = (producto.categoria || producto.category || "").toLowerCase();
    if (cat.includes("tort") || cat.includes("pastel"))
      return ["Harina", "Huevos", "Azúcar", "Mantequilla", "Leche"];
    if (cat.includes("boll") || cat.includes("masas"))
      return ["Harina", "Mantequilla", "Levadura", "Azúcar"];
    if (cat.includes("pan")) return ["Harina", "Agua", "Sal", "Levadura"];
    return ["Ingredientes frescos y de calidad"];
  };

  const ingredientes = useMemo(() => {
    const ingr = producto.ingredientes;
    if (!ingr) return defaultIngredients();
    if (Array.isArray(ingr)) return ingr;
    if (typeof ingr === "string")
      return ingr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return defaultIngredients();
  }, [producto]);

  const reviewsEjemplo = producto.reviews || [
    {
      id: 1,
      name: "María",
      text: "Delicioso y fresco. Volvería a comprar.",
      rating: 5,
    },
    {
      id: 2,
      name: "Carlos",
      text: "Buen sabor, aunque esperaba más relleno.",
      rating: 4,
    },
    {
      id: 3,
      name: "Lucía",
      text: "Perfecto para cumpleaños, se agotó en minutos.",
      rating: 5,
    },
  ];

  const onAdd = () => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) return navigate("/login");
    } catch (e) {
      return navigate("/login");
    }
    addToCart(producto);
  };

  const itemActual = cartItems.find((i) => i.id === producto.id);
  const cantActual = itemActual?.quantity ?? 0;

  const inc = () => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) return navigate("/login");
    } catch (e) {
      return navigate("/login");
    }
    if (cantActual === 0) addToCart(producto);
    else updateQuantity(producto.id, cantActual + 1);
  };

  const dec = () => {
    if (cantActual <= 1) {
      updateQuantity(producto.id, 0);
    } else {
      updateQuantity(producto.id, cantActual - 1);
    }
  };

  const handleAddToCartRelated = (e, prod) => {
    e.stopPropagation();
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) {
        navigate("/login");
        return;
      }
      addToCart(prod);
    } catch (error) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-cafe-blanco py-12 text-cafe-oscuro">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={producto.imagenUrl}
              alt={producto.nombre}
              className="w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-3xl font-subtitulo mb-2 truncate">
                  {producto.nombre}
                </h1>
                <p className="text-xl font-texto text-cafe-oscuro/80 mb-4">
                  ${producto.precio.toLocaleString("es-CL")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {cantActual > 0 ? (
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
                    <button
                      onClick={dec}
                      className="px-3 py-1 bg-white border rounded-md"
                    >
                      -
                    </button>
                    <span className="px-3 text-lg font-subtitulo">
                      {cantActual}
                    </span>
                    <button
                      onClick={inc}
                      className="px-3 py-1 bg-white border rounded-md"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onAdd}
                    className="px-4 py-2 border-1 border-transparent bg-cafe-oscuro text-cafe-claro rounded-xl hover:bg-cafe-claro hover:text-cafe-oscuro hover:border-cafe-oscuro transition-colors duration-300 hover:cursor-pointer"
                  >
                    Agregar al Carrito
                  </button>
                )}
              </div>
            </div>
            <p className="mb-6 text-cafe-oscuro">{producto.descripcion}</p>
            <div className="mb-6">
              <h3 className="font-subtitulo text-lg mb-2">Ingredientes</h3>
              <ul className="list-disc ml-6 text-cafe-oscuro">
                {ingredientes.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="font-subtitulo text-lg mb-2">Opiniones</h3>
              <div className="space-y-4">
                {reviewsEjemplo.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-white rounded-lg shadow-sm border-1 border-cafe-oscuro/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <strong className="font-texto">{r.name}</strong>
                      <span className="text-sm text-cafe-oscuro/70">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-cafe-oscuro/80">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>{" "}
          </div>
        </div>

        {productosRelacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-subtitulo mb-8 text-cafe-oscuro">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productosRelacionados.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => navigate(`/producto/${prod.id}`)}
                  className="bg-white rounded-lg overflow-hidden cursor-pointer border border-cafe-oscuro/20 hover:border-cafe-oscuro transition-color duration-300"
                >
                  <img
                    src={prod.imagenUrl}
                    alt={prod.nombre}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-subtitulo mb-2 text-cafe-oscuro truncate">
                      {prod.nombre}
                    </h3>
                    <p className="text-sm text-cafe-oscuro/70 mb-3 line-clamp-2">
                      {prod.descripcion}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-cafe-oscuro">
                        ${prod.precio.toLocaleString("es-CL")}
                      </span>
                      <button
                        onClick={(e) => handleAddToCartRelated(e, prod)}
                        className="px-4 py-2 bg-cafe-oscuro text-cafe-claro rounded-lg hover:bg-cafe-claro hover:text-cafe-oscuro border border-transparent hover:border-cafe-oscuro transition-colors duration-300"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
