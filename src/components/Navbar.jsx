import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProfileIcon = ({ name }) => (
  <div className="w-10 h-10 rounded-full bg-cafe-oscuro text-cafe-claro flex items-center justify-center font-bold text-lg">
    {name ? name.charAt(0).toUpperCase() : "U"}
  </div>
);

const CartIcon = ({ count }) => (
  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-cafe-oscuro"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count}
      </span>
    )}
  </div>
);

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const cartDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cartItems,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    finalDiscountPercent,
    totalPrice,
  } = useCart();

  const [processingPurchase, setProcessingPurchase] = useState(false);
  const [processedReceipt, setProcessedReceipt] = useState(null);
  const [processingShipment, setProcessingShipment] = useState(false);
  const [shipmentCoords, setShipmentCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [viewingShipment, setViewingShipment] = useState(false);
  const [mapInitError, setMapInitError] = useState(false);
  const [mapDataUrl, setMapDataUrl] = useState(null);
  const [mapGenerating, setMapGenerating] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(loggedInUser);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!cartDropdownOpen) return;
      const el = cartDropdownRef.current;
      if (el && !el.contains(e.target)) setCartDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [cartDropdownOpen]);

  useEffect(() => {
    if (!showMap || !shipmentCoords) return;
    const [lat, lng] = shipmentCoords;
    const z = 16;
    setMapGenerating(true);
    setMapInitError(false);
    setMapDataUrl(null);

    const latRad = (lat * Math.PI) / 180;
    const n = Math.pow(2, z);
    const xFloat = ((lng + 180) / 360) * n;
    const yFloat =
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      n;
    const xtile = Math.floor(xFloat);
    const ytile = Math.floor(yFloat);
    const fx = xFloat - xtile;
    const fy = yFloat - ytile;

    const size = 288;
    const tileSize = size / 3;
    const dpr = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    let cancelled = false;

    const loadTile = (tx, ty) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("tile"));
        img.src = `https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`;
      });

    (async () => {
      try {
        const promises = [];
        for (let dx = -1; dx <= 1; dx++)
          for (let dy = -1; dy <= 1; dy++) {
            promises.push(
              loadTile(xtile + dx, ytile + dy).then((img) => ({ img, dx, dy }))
            );
          }
        const results = await Promise.all(promises);
        if (cancelled) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        results.forEach(({ img, dx, dy }) => {
          const x = (dx + 1) * tileSize;
          const y = (dy + 1) * tileSize;
          try {
            ctx.drawImage(img, x, y, tileSize, tileSize);
          } catch (e) {}
        });
        const markerX = (1 + fx) * tileSize;
        const markerY = (1 + fy) * tileSize;
        ctx.beginPath();
        ctx.fillStyle = "#b22222";
        ctx.arc(markerX, markerY - 8, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#800000";
        ctx.stroke();
        setMapDataUrl(canvas.toDataURL());
        setMapGenerating(false);
      } catch (e) {
        if (cancelled) return;
        setMapInitError(true);
        setMapGenerating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showMap, shipmentCoords]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/");
  };

  const renderProcessedReceipt = () => {
    if (!processedReceipt) return null;
    if (!viewingShipment) {
      return (
        <div>
          <h3 className="font-subtitulo text-lg mb-2">Boleta procesada</h3>
          <p className="text-sm text-cafe-oscuro/70 mb-2">
            Fecha: {new Date(processedReceipt.date).toLocaleString()}
          </p>
          {processedReceipt.items.map((it) => (
            <div key={it.id} className="flex justify-between py-2 border-b-1">
              <div>
                <p className="font-subtitulo text-sm">
                  {it.nombre} x{it.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-texto">
                  ${(it.precio * it.quantity).toLocaleString("es-CL")}
                </p>
              </div>
            </div>
          ))}
          <div className="border-t-1 pt-3 mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>${processedReceipt.subtotal.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between text-sm mb-1 text-red-600">
              <span>Descuento ({finalDiscountPercent}%)</span>
              <span>
                -${processedReceipt.discountAmount.toLocaleString("es-CL")}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                ${processedReceipt.totalPrice.toLocaleString("es-CL")}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                if (processingShipment) return;
                setProcessingShipment(true);
                setShowMap(false);
                setMapInitError(false);
                setTimeout(() => {
                  const lat = -33.6 + Math.random() * 0.2;
                  const lng = -70.7 + Math.random() * 0.2;
                  setShipmentCoords([lat, lng]);
                  setProcessingShipment(false);
                  setShowMap(true);
                  setViewingShipment(true);
                }, 2000);
              }}
              className="mt-3 w-full bg-cafe-oscuro text-cafe-claro px-4 py-2 rounded-xl"
            >
              {processingShipment ? "Procesando envío..." : "Ver seguimiento"}
            </button>
          </div>
        </div>
      );
    }

    const [lat, lng] = shipmentCoords || [0, 0];
    const width = 288;
    const height = 288;
    const zoom = 16;
    const marker = `${lat},${lng},red-pushpin`;
    const staticUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${encodeURIComponent(
      marker
    )}`;
    const svg = `<?xml version='1.0' encoding='UTF-8'?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>\n  <rect width='100%' height='100%' fill='#f7f3ef' stroke='#bcaea6' rx='12' />\n  <circle cx='${
      width / 2
    }' cy='${
      height / 2 - 10
    }' r='10' fill='#b22222' stroke='#800000' stroke-width='2'/>\n  <text x='50%' y='${
      height - 28
    }' font-family='Inter, Arial, sans-serif' font-size='14' fill='#3b2f2f' text-anchor='middle'>${lat.toFixed(
      5
    )}, ${lng.toFixed(5)}</text>\n</svg>`;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-subtitulo text-lg">Seguimiento de envío</h3>
          <button
            onClick={() => {
              setViewingShipment(false);
              setShowMap(false);
              setShipmentCoords(null);
            }}
            className="text-sm text-cafe-oscuro/70"
          >
            Volver
          </button>
        </div>
        {processingShipment && (
          <div className="p-4 text-center text-sm text-cafe-oscuro/80">
            Procesando envío, por favor espera...
          </div>
        )}
        {!processingShipment && showMap && shipmentCoords && (
          <div
            className="mt-2 p-3 bg-cafe-blanco rounded-lg border-1 border-cafe-oscuro mx-auto"
            style={{ width: "18rem" }}
          >
            {mapGenerating ? (
              <div className="p-6">Generando mapa...</div>
            ) : mapDataUrl ? (
              <img
                src={mapDataUrl}
                alt={`Mapa ${lat},${lng}`}
                width={width}
                height={height}
                style={{ display: "block", borderRadius: 8, margin: "0 auto" }}
              />
            ) : !mapInitError ? (
              <img
                src={staticUrl}
                alt={`Mapa ${lat},${lng}`}
                width={width}
                height={height}
                onError={() => setMapInitError(true)}
                style={{ display: "block", borderRadius: 8, margin: "0 auto" }}
              />
            ) : (
              <img
                src={dataUrl}
                alt={`Coordenadas ${lat},${lng}`}
                width={width}
                height={height}
                style={{ display: "block", borderRadius: 8, margin: "0 auto" }}
              />
            )}

            {!thankYouVisible ? (
              <div className="mt-3 text-center">
                <button
                  onClick={() => {
                    try {
                      if (typeof clearCart === "function") {
                        clearCart();
                      } else if (
                        typeof window !== "undefined" &&
                        window.localStorage
                      ) {
                        localStorage.removeItem("cartItems");
                      }
                    } catch (e) {
                    }
                    try {
                      setProcessedReceipt(null);
                    } catch (e) {}
                    setProcessingPurchase(false);
                    setViewingShipment(false);
                    setShowMap(false);
                    setShipmentCoords(null);
                    setMapDataUrl(null);
                    setMapGenerating(false);

                    setThankYouVisible(true);
                    setTimeout(() => {
                      setThankYouVisible(false);
                      setCartDropdownOpen(false);
                    }, 2200);
                  }}
                  className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
                >
                  Confirmar entrega
                </button>
              </div>
            ) : (
              <div className="mt-3 p-3 text-center text-cafe-oscuro font-texto">
                Gracias por comprar en Mil Sabores
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-cafe-claro p-6 z-20 sticky top-0 border-b-1 border-cafe-oscuro shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-3 items-center gap-4">

        <div className="flex justify-start">
          <NavLink to="/" className="text-cafe-oscuro text-5xl font-titulo">
            Mil Sabores
          </NavLink>
        </div>


        <div className="flex justify-center">
          <ul className="flex gap-8 items-center">
            <li>
              <NavLink
                to="/productos"
                className="text-cafe-oscuro hover:underline font-texto"
              >
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className="text-cafe-oscuro hover:underline font-texto"
              >
                Comunidad
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="text-cafe-oscuro hover:underline font-texto"
              >
                Sobre Nosotros
              </NavLink>
            </li>
          </ul>
        </div>


        <div className="flex justify-end relative">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-texto text-cafe-oscuro">
                Hola, {user.name}
              </span>
              <button
                className="hover:cursor-pointer flex items-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <ProfileIcon name={user.name} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 top-full w-48 bg-cafe-claro rounded-2xl shadow-lg border-1 border-cafe-oscuro py-2">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-cafe-oscuro hover:bg-cafe-oscuro/10"
                  >
                    Modificar Cuenta
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-cafe-oscuro hover:bg-cafe-oscuro/10 hover:cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
              <button
                className="hover:cursor-pointer flex items-center"
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
              >
                <CartIcon count={cartCount} />
              </button>
            </div>
          ) : (
            <ul className="flex items-center gap-4">
              <li className="flex items-center">
                <NavLink
                  to="/login"
                  className="text-cafe-oscuro hover:underline font-texto"
                >
                  Iniciar Sesión
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/register"
                  className="text-cafe-oscuro font-texto border-1 border-cafe-oscuro rounded-xl px-3 py-2 hover:bg-cafe-oscuro hover:text-cafe-claro transition-all duration-200"
                >
                  Registrarse
                </NavLink>
              </li>
              <li className="flex items-center">
                <button
                  className="hover:cursor-pointer flex items-center"
                  onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                >
                  <CartIcon count={cartCount} />
                </button>
              </li>
            </ul>
          )}

          {cartDropdownOpen && (
            <div
              ref={cartDropdownRef}
              className="absolute right-0 mt-2 top-full w-80 md:w-96 bg-cafe-claro rounded-2xl shadow-lg border-1 border-cafe-oscuro py-2 z-30"
            >
              {!user ? (
                <div className="p-6 text-center">
                  <p className="font-texto text-cafe-oscuro">
                    Por favor, inicia sesión para ver y gestionar tu carrito de
                    compras.
                  </p>
                  <NavLink
                    to="/login"
                    className="mt-4 inline-block font-texto bg-cafe-oscuro text-cafe-claro px-4 py-2 rounded-xl hover:bg-cafe-oscuro/90 transition-all"
                    onClick={() => setCartDropdownOpen(false)}
                  >
                    Iniciar Sesión
                  </NavLink>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-texto text-cafe-oscuro">
                    Tu carrito está vacío.
                  </p>
                </div>
              ) : (
                <>
                  {processingPurchase ? (
                    <div className="p-6 text-center">
                      <h3 className="font-subtitulo text-lg mb-2">
                        Estamos procesando el pago
                      </h3>
                      <p className="text-cafe-oscuro/80">Por favor espera...</p>
                    </div>
                  ) : processedReceipt ? (
                    <div className="p-4 max-h-96 overflow-y-auto">
                      {renderProcessedReceipt()}
                    </div>
                  ) : (
                    <>
                      <div className="max-h-96 overflow-y-auto p-2">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-2 rounded-lg hover:bg-cafe-oscuro/5"
                          >
                            <img
                              src={item.imagenUrl}
                              alt={item.nombre}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <p className="font-subtitulo text-sm">
                                {item.nombre}
                              </p>
                              <p className="font-texto text-xs text-cafe-oscuro/70">
                                ${item.precio.toLocaleString("es-CL")}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="px-2 border rounded-md"
                                >
                                  -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="px-2 border rounded-md"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar"
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
                        ))}
                      </div>

                      <div className="border-t-1 border-cafe-oscuro/20 p-4">
                        <div className="mb-2 text-sm text-cafe-oscuro/80">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${subtotal.toLocaleString("es-CL")}</span>
                          </div>
                          {discountAmount > 0 && (
                            <div className="flex justify-between text-red-600">
                              <span>Descuento ({finalDiscountPercent}%):</span>
                              <span>
                                -${discountAmount.toLocaleString("es-CL")}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center font-bold">
                          <span className="font-subtitulo">Total:</span>
                          <span className="font-texto">
                            ${totalPrice.toLocaleString("es-CL")}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (processingPurchase) return;
                            setCartDropdownOpen(true);
                            setProcessedReceipt(null);
                            setProcessingPurchase(true);
                            const snapshot = {
                              items: cartItems.map((it) => ({ ...it })),
                              subtotal,
                              discountAmount,
                              totalPrice,
                              date: new Date().toISOString(),
                            };
                            setTimeout(() => {
                              setProcessingPurchase(false);
                              setProcessedReceipt(snapshot);
                            }, 2000);
                          }}
                          disabled={processingPurchase}
                          className="w-full mt-4 font-texto bg-cafe-oscuro text-cafe-claro px-4 py-2 rounded-xl hover:bg-cafe-oscuro/90 transition-all disabled:opacity-50"
                        >
                          {processingPurchase
                            ? "Procesando..."
                            : "Finalizar Compra"}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
