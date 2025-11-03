import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroImage from "../assets/images/hero-image.jpg";
import { productosPasteleria } from "../ProductosData";
import { useCart } from "../context/CartContext";

function ProductCarousel({ title, products }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const handleAddToCart = (e, producto) => {
    e.stopPropagation();
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) {
        navigate("/login");
        return;
      }
      addToCart(producto);
    } catch (error) {
      navigate("/login");
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl text-cafe-oscuro font-subtitulo mb-6">{title}</h2>
      <div className="relative group">

        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cafe-blanco to-transparent z-[5] pointer-events-none" />
        )}


        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-cafe-oscuro rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto pb-16 gap-6 scrollbar-hide scroll-smooth border-b-1 border-dashed border-cafe-oscuro/40"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {products.map((producto) => (
            <div
              key={producto.id}
              onClick={() => navigate(`/producto/${producto.id}`)}
              className="flex-shrink-0 w-72 bg-white rounded-lg overflow-hidden cursor-pointer border-1 border-cafe-oscuro/20 hover:border-cafe-oscuro transition-all duration-300"
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
                    onClick={(e) => handleAddToCart(e, producto)}
                    className="px-4 pb-2 pt-1 text-center bg-cafe-oscuro text-cafe-claro rounded-xl hover:bg-cafe-claro hover:text-cafe-oscuro border border-transparent hover:border-cafe-oscuro transition-colors duration-300 hover:cursor-pointer"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cafe-blanco to-transparent z-[5] pointer-events-none" />
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-cafe-oscuro rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categorias = [...new Set(productosPasteleria.map((p) => p.categoria))];

  const productosPorCategoria = categorias.reduce((acc, categoria) => {
    acc[categoria] = productosPasteleria.filter(
      (p) => p.categoria === categoria
    );
    return acc;
  }, {});

  return (
    <section className="min-h-screen bg-cafe-blanco">
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={HeroImage}
          alt="Mil Sabores"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl text-white font-subtitulo text-center drop-shadow-lg">
            Bienvenido a Mil Sabores
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-cafe-oscuro font-subtitulo mb-4">
            Nuestros Productos
          </h2>
          <p className="text-lg text-cafe-oscuro/70">
            Descubre nuestra selección de productos artesanales
          </p>
        </div>

        {categorias.map((categoria) => (
          <ProductCarousel
            key={categoria}
            title={categoria}
            products={productosPorCategoria[categoria]}
          />
        ))}
      </div>


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
    </section>
  );
}
