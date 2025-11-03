import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem("cartItems");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((item) => item.id === product.id);
      if (itemInCart) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const loggedInUser = (() => {
    try {
      const raw = JSON.parse(localStorage.getItem("loggedInUser")) || null;
      if (!raw) return null;
      const normalizeEmail = (e) => (e || "").trim().toLowerCase();
      raw.email = normalizeEmail(raw.email);

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find((u) => normalizeEmail(u.email) === raw.email);
      if (found) {
        if (!raw.edad && found.fechaNacimiento) {
          const nacimiento = new Date(found.fechaNacimiento);
          const hoy = new Date();
          let edad = hoy.getFullYear() - nacimiento.getFullYear();
          const m = hoy.getMonth() - nacimiento.getMonth();
          if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
          }
          raw.edad = edad;
        }
        raw.isDuoc = typeof raw.isDuoc === "boolean" ? raw.isDuoc : /@duocuc\.cl$/i.test(raw.email);
        raw.hasFelices50 = typeof raw.hasFelices50 === "boolean" ? raw.hasFelices50 : !!found.hasFelices50;

        const idx = users.findIndex((u) => normalizeEmail(u.email) === raw.email);
        if (idx > -1) {
          users[idx] = { ...users[idx], ...raw };
          localStorage.setItem("users", JSON.stringify(users));
          localStorage.setItem("loggedInUser", JSON.stringify(raw));
        }
      }

      return raw;
    } catch (e) {
      return null;
    }
  })();

  let finalDiscountPercent = 0;
  if (loggedInUser) {
    if (typeof loggedInUser.edad === "number" && loggedInUser.edad >= 50) {
      finalDiscountPercent += 50 
    }
    if (loggedInUser.hasFelices50) {
      finalDiscountPercent += 10;
    }
  }

  const hasFreeBirthdayCake = (() => {
    if (!loggedInUser || !loggedInUser.isDuoc || !loggedInUser.fechaNacimiento)
      return false;
    try {
      const dob = new Date(loggedInUser.fechaNacimiento);
      const today = new Date();
      return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
    } catch (e) {
      return false;
    }
  })();

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.precio || 0) * item.quantity,
    0
  );

  const discountAmount = Number((subtotal * Math.min(finalDiscountPercent, 100) / 100).toFixed(2));
  const totalPrice = Number((subtotal - discountAmount).toFixed(2));

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    discountAmount,
    totalPrice,
    finalDiscountPercent,
    hasFreeBirthdayCake,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
