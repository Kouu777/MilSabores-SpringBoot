import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 
import ProtectedRoute from "../components/ProtectedRoute"; 
export default function Checkout() {
  const { cartItems, subtotal, discountAmount, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      clearCart();
    }, 2000);
    return () => clearTimeout(t);
  }, [clearCart]); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-claro">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-subtitulo mb-4">Estamos procesando el pago</h2>
          <p className="text-cafe-oscuro/80">Por favor espera un momento...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute> {}
      <section className="min-h-screen bg-cafe-blanco flex items-center justify-center">
        <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="font-subtitulo text-3xl mb-6">Boleta de Compra</h2>
          
          {}
          {user && (
            <div className="mb-6 p-4 bg-cafe-claro rounded-xl">
              <h3 className="font-subtitulo text-lg mb-2">Información del Cliente</h3>
              <p className="text-cafe-oscuro/80">{user.nombre} {user.apellido}</p>
              <p className="text-cafe-oscuro/80">{user.email}</p>
              {user.direccion && (
                <p className="text-cafe-oscuro/80">Envío a: {user.direccion}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            {cartItems.length === 0 ? (
              <p className="text-cafe-oscuro">No hay items en el carrito (se limpió tras el pago).</p>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b-1">
                    <div>
                      <p className="font-subtitulo">{item.nombre} x{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-texto">${(item.precio * item.quantity).toLocaleString("es-CL")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t-1 pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Descuento</span>
              <span>-${discountAmount.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice.toLocaleString("es-CL")}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 rounded-xl bg-cafe-oscuro text-cafe-claro hover:bg-cafe-oscuro/90 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}