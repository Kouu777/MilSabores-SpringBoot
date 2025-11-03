import { useState, useEffect } from "react";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [newPost, setNewPost] = useState({
    titulo: "",
    contenido: "",
    autor: "",
    categoria: "General",
  });

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedPosts = localStorage.getItem("communityPosts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const samplePosts = [
        {
          id: 1,
          titulo: "¡Bienvenidos a nuestra comunidad!",
          contenido:
            "Estamos emocionados de abrir este espacio para compartir recetas, tips de repostería y experiencias con nuestros productos. ¡Esperamos ver sus creaciones!",
          autor: "Mil Sabores",
          categoria: "Anuncios",
          fecha: new Date().toISOString(),
          likes: 15,
        },
        {
          id: 2,
          titulo: "Mi experiencia con las tortas de chocolate",
          contenido:
            "¡Probé la torta de chocolate de Mil Sabores y quedé encantada! El equilibrio perfecto entre dulce y suave. Perfecta para cualquier celebración.",
          autor: "María González",
          categoria: "Reseñas",
          fecha: new Date(Date.now() - 86400000).toISOString(),
          likes: 8,
        },
        {
          id: 3,
          titulo: "Tips para decorar cupcakes en casa",
          contenido:
            "Después de años decorando cupcakes, aquí van mis mejores consejos: usar manga pastelera con boquilla de estrella, dejar enfriar completamente antes de decorar, y no tener miedo de experimentar con colores.",
          autor: "Carlos Ramírez",
          categoria: "Recetas y Tips",
          fecha: new Date(Date.now() - 172800000).toISOString(),
          likes: 23,
        },
      ];
      setPosts(samplePosts);
      localStorage.setItem("communityPosts", JSON.stringify(samplePosts));
    }
  }, []);

  
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("communityPosts", JSON.stringify(posts));
    }
  }, [posts]);

  const categories = [
    "Todos",
    "Recetas y Tips",
    "Reseñas",
    "Eventos",
    "Anuncios",
    "General",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.titulo && newPost.contenido && newPost.autor) {
      const post = {
        id: Date.now(),
        ...newPost,
        fecha: new Date().toISOString(),
        likes: 0,
      };
      setPosts([post, ...posts]);
      setNewPost({
        titulo: "",
        contenido: "",
        autor: "",
        categoria: "General",
      });
      setShowForm(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDelete = (postId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")
    ) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  const filteredPosts =
    filterCategory === "Todos"
      ? posts
      : posts.filter((post) => post.categoria === filterCategory);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-cafe-blanco min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-cafe-oscuro">
        <div className="mb-12 pb-8 border-b-1 border-cafe-oscuro/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-subtitulo text-4xl md:text-5xl mb-2">
                Comunidad Mil Sabores
              </h1>
              <p className="font-texto text-base text-cafe-oscuro/70">
                Comparte tus experiencias, recetas y momentos especiales!
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="font-texto bg-cafe-oscuro text-cafe-claro px-6 py-3 border-1 border-transparent
                  rounded-xl hover:bg-cafe-blanco
                hover:text-cafe-oscuro hover:border-cafe-oscuro transition-all duration-300 hover:cursor-pointer hover:"
            >
              {showForm ? "Cancelar" : "+ Nueva Publicación"}
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8 flex items-center gap-3 flex-wrap">
          <span className="font-texto text-l text-cafe-oscuro/70">
            Categoría:
          </span>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`font-texto text-sm px-4 py-2 rounded-xl border-1 border-cafe-oscuro transition-all
                    duration-300 hover:border-cafe-oscuro hover:cursor-pointer ${
                      filterCategory === cat
                        ? "bg-cafe-oscuro text-cafe-claro border-cafe-oscuro"
                        : "bg-white/80 text-cafe-oscuro border-cafe-oscuro/30 hover:border-cafe-oscuro"
                    }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {}
        {showForm && (
          <div className="mb-8 bg-cafe-claro border-1 border-cafe-oscuro rounded-2xl p-6  animate-fadeIn">
            <h2 className="font-subtitulo text-2xl mb-4">
              Crear Nueva Publicación
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-texto text-sm font-semibold block mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={newPost.titulo}
                  onChange={(e) =>
                    setNewPost({ ...newPost, titulo: e.target.value })
                  }
                  placeholder="Escribe un título llamativo..."
                  className="font-texto w-full px-4 py-2 border border-cafe-oscuro/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cafe-oscuro/40 focus:border-cafe-oscuro transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="font-texto text-sm font-semibold block mb-2">
                  Contenido *
                </label>
                <textarea
                  value={newPost.contenido}
                  onChange={(e) =>
                    setNewPost({ ...newPost, contenido: e.target.value })
                  }
                  placeholder="Comparte tu historia, receta, o experiencia..."
                  rows="6"
                  className="font-texto w-full px-4 py-2 border border-cafe-oscuro/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cafe-oscuro/40 focus:border-cafe-oscuro transition-all duration-200 resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-texto text-sm font-semibold block mb-2">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    value={newPost.autor}
                    onChange={(e) =>
                      setNewPost({ ...newPost, autor: e.target.value })
                    }
                    placeholder="¿Cómo te llamas?"
                    className="font-texto w-full px-4 py-2 border border-cafe-oscuro/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cafe-oscuro/40 focus:border-cafe-oscuro transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-texto text-sm font-semibold block mb-2">
                    Categoría *
                  </label>
                  <select
                    value={newPost.categoria}
                    onChange={(e) =>
                      setNewPost({ ...newPost, categoria: e.target.value })
                    }
                    className="font-texto w-full px-4 py-2 border border-cafe-oscuro/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cafe-oscuro/40 focus:border-cafe-oscuro cursor-pointer transition-all duration-200"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="font-texto bg-cafe-oscuro text-cafe-claro px-6 py-2 rounded-xl hover:bg-cafe-oscuro/90 transition-all duration-300 hover:scale-105"
                >
                  Publicar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="font-texto bg-white/80 text-cafe-oscuro px-6 py-2 rounded-xl border-1 border-cafe-oscuro/30 hover:border-cafe-oscuro/50 transition-all duration-300 hover:scale-105"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white/50 rounded-xl border-1 border-dashed border-cafe-oscuro/30">
              <p className="font-texto text-lg text-cafe-oscuro/60">
                No hay publicaciones en esta categoría aún.
              </p>
              <p className="font-texto text-sm text-cafe-oscuro/50 mt-2">
                ¡Sé el primero en compartir algo!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white/80 border-1 border-cafe-oscuro/30 rounded-xl p-6 hover:border-cafe-oscuro transition-all
                    duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-subtitulo text-2xl mb-2">
                      {post.titulo}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-cafe-oscuro/70">
                      <span className="font-texto font-semibold">
                        {post.autor}
                      </span>
                      <span className="font-texto">•</span>
                      <span className="font-texto">
                        {formatDate(post.fecha)}
                      </span>
                      <span className="font-texto px-3 py-1 bg-cafe-oscuro/10 rounded-full text-xs">
                        {post.categoria}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-cafe-oscuro/40 hover:text-red-500 hover:cursor-pointer transition-colors duration-200 ml-4"
                    title="Eliminar publicación"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <p className="font-texto text-base leading-relaxed mb-4 text-cafe-oscuro/90 whitespace-pre-wrap">
                  {post.contenido}
                </p>
                <div className="flex items-center gap-2 pt-3 border-t-1 border-cafe-oscuro/10">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 font-texto text-sm px-4 py-2 rounded-xl border-1 border-transparent bg-cafe-claro hover:border-cafe-oscuro transition-all hover:cursor-pointer duration-300 hover:scale-103"
                  >
                    <span className="font-semibold">{post.likes}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-4 right-4 bg-cafe-oscuro px-4 py-4 border-1 m-4 border-transparent rounded-full 
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
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
