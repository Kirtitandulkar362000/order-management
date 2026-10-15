import { useMemo, useState } from "react";
import type { CartItem, MenuItem } from "../types/menuTypes";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(item: MenuItem) {
    if (item.is_available === 0) return;

    setItems((currentItems) => {
      const existing = currentItems.find(
        (cartItem) => cartItem.item.id === item.id
      );

      if (existing) {
        return currentItems.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...currentItems, { item, quantity: 1 }];
    });
  }

  function increaseQuantity(id: number) {
    setItems((currentItems) =>
      currentItems.map((cartItem) =>
        cartItem.item.id === id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  }

  function decreaseQuantity(id: number) {
    setItems((currentItems) =>
      currentItems
        .map((cartItem) =>
          cartItem.item.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setItems((currentItems) =>
      currentItems.filter((cartItem) => cartItem.item.id !== id)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, cartItem) =>
          total + cartItem.item.price * cartItem.quantity,
        0
      ),
    [items]
  );

  const totalQuantity = useMemo(
    () => items.reduce((total, cartItem) => total + cartItem.quantity, 0),
    [items]
  );

  return {
    items,
    subtotal,
    totalQuantity,
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart
  };
}