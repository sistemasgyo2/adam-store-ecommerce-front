import type { Cart, CartTotal, ProductCart } from '@/types/cart';
import type { BillingInfo, DeliveryInfo, Store } from '@/types/checkout';
import type { Price } from '@/types/product';
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { toast } from 'vue-sonner';

export const useCartStore = defineStore('cart', () => {
  const sanctumFetch = useSanctumClient();

  const id: Ref<string | null> = ref<string | null>(null);
  const store: Ref<Store | null> = ref<Store | null>(null);
  const currency: Ref<string> = ref<string>('PEN');
  const items: Ref<ProductCart[]> = ref<ProductCart[]>([]);
  const deliveryInfo: Ref<DeliveryInfo | undefined> = ref<DeliveryInfo | undefined>();
  const billingInfo: Ref<BillingInfo | undefined> = ref<BillingInfo | undefined>();
  const subtotal: Ref<Price> = ref<Price>({
    amount: 0,
    decimal: 0.00,
    formatted: "S/ 0.00"
  });

  const totals = reactive<CartTotal>({
    items_total: {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    },
    subtotal: {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    },
    shipping: {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    },
    taxes: {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    },
    total: {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    },
  });

  const totalQuantity: ComputedRef<number> = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const totalPrice: ComputedRef<string> = computed(() => {
    const total = items.value.reduce((sum, item) => sum + item.quantity * (item.price.decimal ?? 0), 0);
    return total.toFixed(2);
  });


  const hasStore: ComputedRef<boolean> = computed(() => store.value != null);

  const setDataCart = (data: Cart) => {
    id.value = data.id;
    currency.value = data.currency;
    items.value = data.lines;
    totals.items_total = data.totals.items_total;
    totals.subtotal = data.totals.subtotal;
    totals.shipping = data.totals.shipping;
    totals.taxes = data.totals.taxes;
    totals.total = data.totals.total;
    deliveryInfo.value = data.delivery_info;

    billingInfo.value = data.billing_info;
  }


  const playSuccessSound = () => {
    if (import.meta.client) {
      try {
        const audio = new Audio('/sounds/success.mp3');
        audio.play().catch(e => console.warn("Error al reproducir el sonido:", e));
      } catch (e) {
        console.error("No se pudo crear el objeto Audio:", e);
      }
    }
  };

  const playErrorSound = () => {
    if (import.meta.client) {
      try {
        const audio = new Audio('/sounds/error.mp3');
        audio.play().catch(e => console.warn("Error al reproducir el sonido de error:", e));
      } catch (e) {
        console.error("No se pudo crear el objeto Audio para error:", e);
      }
    }
  };

  const fetchCart = async () => {
    if (!import.meta.client) {
      console.log("fetchCart llamado en el servidor, no se ejecuta.");
      return;
    }

    if (id.value !== null) {
      console.log("Carrito ya inicializado, no se vuelve a buscar.");
      return;
    }

    try {
      const cartResponse: any = await sanctumFetch('/api/carts', {
        method: 'POST',
        body: {},
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      id.value = cartResponse.id;
      currency.value = cartResponse.currency;
      items.value = cartResponse.lines;
      subtotal.value = cartResponse.subtotal;
    } catch (err) {
      console.error("Error inesperado en fetchCart (nivel de try/catch):", err);
    }



    // if (_fetchCartPromise) {
    //   console.log("Ya hay una petición de carrito en curso.");
    //   return _fetchCartPromise;
    // }

    // _fetchCartPromise = (async () => {
    //   try {
    //     console.log("Iniciando petición de carrito...");
    //     const { data: apiData, pending: apiPending, error: apiError, execute } = await useLazySanctumFetch('/api/carts', {
    //       method: 'POST',
    //       body: {},
    //       headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //       }
    //     });

    //     const stopWatching = watch([apiData, apiError, apiPending], ([newData, newError, newPending]) => {
    //       if (!newPending) {
    //         if (newData) {
    //           id.value = newData.id;
    //           currency.value = newData.currency;
    //           items.value = newData.lines;
    //           subtotal.value = newData.subtotal;
    //           console.log("Store de carrito actualizado con datos de la API.");
    //         } else if (newError) {
    //           console.error("Error de la API del carrito:", newError);
    //         } else {
    //           console.log("API Carrito - Petición finalizada sin datos ni errores explícitos (ej. 204 No Content).");
    //         }
    //         stopWatching();
    //       } else {
    //         console.log("API Carrito - Petición aún pendiente...");
    //       }
    //     }, { immediate: true });
    //   } catch (err) {
    //     console.error("Error inesperado en fetchCart (nivel de try/catch):", err);
    //   } finally {
    //     _fetchCartPromise = null;
    //   }
    // })();

    // return _fetchCartPromise;
  };

  const addToCart = async (variantId: number, quantity: number) => {


    if (!id.value) {
      console.warn("No hay ID de carrito disponible, intentando obtenerlo antes de añadir.");
      await fetchCart();
      if (!id.value) {
        console.error("No se pudo obtener el ID del carrito para añadir elementos. Abortando addToCart.");
        return;
      }
    }

    try {
      const cartResponse: any = await sanctumFetch(`/api/carts/${id.value}/items`, {
        method: 'POST',
        body: {
          variant: variantId,
          quantity: quantity
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(store.value ? { 'X-Store-ID': String(store.value.id) } : {})
        }
      });

      const existingItemIndex = items.value.findIndex(item => item.id === cartResponse.id);

      if (existingItemIndex !== -1) {
        items.value[existingItemIndex] = cartResponse;
        console.log("Item existente en el carrito actualizado:", cartResponse.id);
      } else {
        items.value.push(cartResponse);
        console.log("Nuevo item añadido al carrito:", cartResponse.id);
      }

      toast.success('Producto agregado al carrito');
      playSuccessSound();
    } catch (error) {
      const err = useSanctumError(error);

      if (err.isValidationError) {
        const messages = Object.values(err.fieldErrors).flat();
        messages.forEach((msg) => toast.error(msg as string));
      } else if (err.generalMessage) {
        toast.error(err.generalMessage);
      } else {
        toast.error('Error al agregar el producto al carrito.');
      }

      playErrorSound();

      console.error("Error capturado durante la actualización directa del carrito:", err);
    }

    // let stopAddWatching: (() => void) | undefined;
    // const { data: addData, pending: addPending, error: addError } = await useLazySanctumFetch(`/api/carts/${id.value}/items`, {
    //   method: 'POST',
    //   body: {
    //     variant: variantId,
    //     quantity: quantity
    //   },
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   }
    // });

    // const addDone = new Promise<void>((resolve, reject) => {
    //   stopAddWatching = watch([addData, addError, addPending], ([newAddData, newAddError, newAddPending]) => {
    //     if (!newAddPending) {
    //       if (newAddData) {
    //         const existingItemIndex = items.value.findIndex(item => item.id === newAddData.id);

    //         if (existingItemIndex !== -1) {
    //           items.value[existingItemIndex] = newAddData;
    //           console.log("Item existente en el carrito actualizado:", newAddData.id);
    //         } else {
    //           items.value.push(newAddData);
    //           console.log("Nuevo item añadido al carrito:", newAddData.id);
    //         }

    //         toast.success('Producto agregado al carrito');
    //         playSuccessSound();
    //         resolve();
    //       } else if (newAddError) {
    //         console.error("Error al añadir item al carrito:", newAddError);
    //         if (newAddError.statusCode === 422 && newAddError.data && newAddError.data.errors) {
    //           const messages = Object.values(newAddError.data.errors).flat();
    //           messages.forEach((msg) => toast.error(msg as string));
    //         } else if (newAddError.data && newAddError.data.message) {
    //           toast.error(newAddError.data.message);
    //         } else {
    //           toast.error('Error al agregar el producto al carrito.');
    //         }
    //         playErrorSound();
    //         reject(newAddError);
    //       } else {
    //         reject(new Error("No se recibieron datos del ítem ni error después de añadir al carrito."));
    //       }
    //       if (stopAddWatching) {
    //         stopAddWatching();
    //       }
    //     }
    //   }, { immediate: true });
    // });

    // try {
    //   await addDone;
    // } catch (error) {
    //   console.error("Error capturado durante la actualización directa del carrito:", error);
    //   throw error;
    // }

  };

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      if (!import.meta.client) {
        console.log("updateItem llamado en el servidor, no se ejecuta.");
        return;
      }

      const item = items.value.find((i) => i.id === itemId);

      if (!item) {
        return;
      }

      const rawPrice = item.price?.decimal?.toString() ?? '0'; // fallback a '0' si es null o undefined
      const price = parseFloat(rawPrice);          // aseguramos que sea número

      item.quantity = quantity;

      const subtotalDecimal = price * quantity;
      item.subtotal.decimal = parseFloat(subtotalDecimal.toFixed(2));
      item.subtotal.formatted = 'S/ ' + item.subtotal.decimal;

      let stopAddWatching: (() => void) | undefined;
      const { data: updateData, pending: updatePending, error: updateError, status: updateStatus } = await useLazySanctumFetch(`/api/carts/${id.value}/items/${itemId}`, {
        method: 'PUT',
        body: {
          quantity: quantity
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(store.value ? { 'X-Store-ID': String(store.value.id) } : {})
        }
      });

      const updateDone = new Promise<void>((resolve, reject) => {
        stopAddWatching = watch([updateData, updateError, updatePending, updateStatus], ([newUpdateData, newUpdateError, newUpdatePending, newUpdateStatus]) => {
          console.log(newUpdateStatus, 'newUpdateStatus');

          if (newUpdateStatus == 'success') {
            const existingItemIndex = items.value.findIndex(item => item.id === itemId);

            items.value[existingItemIndex].quantity = quantity;
            console.log("Item en el carrito actualizado:", itemId);

            toast.success('Producto actualizado');
            playSuccessSound();
            resolve();
          } else {
            if (newUpdateError) {
              console.error("Error al actualizar item:", newUpdateError);
              if (newUpdateError.statusCode === 422 && newUpdateError.data && newUpdateError.data.errors) {
                const messages = Object.values(newUpdateError.data.errors).flat();
                messages.forEach((msg) => toast.error(msg as string));
              } else if (newUpdateError.data && newUpdateError.data.message) {
                toast.error(newUpdateError.data.message);
              } else {
                toast.error('Error al actualizar el producto.');
              }
              playErrorSound();
              reject(newUpdateError);
            } else {
              reject(new Error("No se recibieron datos del ítem ni error después de añadir al carrito."));
            }
          }

          if (stopAddWatching) {
            stopAddWatching();
          }
        }, { immediate: true });
      });

      try {
        await updateDone;
      } catch (error) {
        console.error("Error capturado durante la actualización directa del carrito:", error);
        throw error;
      }
    } catch (err) {
      console.error("Error añadiendo al carrito (nivel de try/catch final):", err);
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      if (!import.meta.client) {
        console.log("delete item llamado en el servidor, no se ejecuta.");
        return;
      }

      const item = items.value.find((i) => i.id === itemId);

      if (!item) {
        return;
      }

      let stopAddWatching: (() => void) | undefined;
      const { data: deleteData, pending: deletePending, error: deleteError, status: deleteStatus } = await useLazySanctumFetch(`/api/carts/${id.value}/items/${itemId}`, {
        method: 'DELETE',
      });

      const deleteDone = new Promise<void>((resolve, reject) => {
        stopAddWatching = watch([deleteData, deleteError, deletePending, deleteStatus], ([newDeleteData, newDeleteError, newDeletePending, newDeleteStatus]) => {
          console.log(newDeleteStatus, 'newDeleteStatus');

          if (newDeleteStatus == 'success') {
            items.value = items.value.filter((i) => i.id != itemId);

            toast.success('Producto eliminado del carrito');
            playSuccessSound();
            console.log("Item en el carrito eliminado:", itemId);

            resolve();
          } else {
            if (newDeleteError) {
              console.error("Error al actualizar item:", newDeleteError);
              if (newDeleteError.statusCode === 422 && newDeleteError.data && newDeleteError.data.errors) {
                const messages = Object.values(newDeleteError.data.errors).flat();
                messages.forEach((msg) => toast.error(msg as string));
              } else if (newDeleteError.data && newDeleteError.data.message) {
                toast.error(newDeleteError.data.message);
              } else {
                toast.error('Error al actualizar el producto.');
              }
              playErrorSound();
              reject(newDeleteError);
            } else {
              reject(new Error("No se recibieron datos del ítem ni error después de añadir al carrito."));
            }
          }

          if (stopAddWatching) {
            stopAddWatching();
          }
        }, { immediate: true });
      });

      try {
        await deleteDone;
      } catch (error) {
        console.error("Error capturado durante la actualización directa del carrito:", error);
        throw error;
      }
    } catch (err) {
      console.error("Error añadiendo al carrito (nivel de try/catch final):", err);
    }
  };

  const getCart = async () => {
    const response = await sanctumFetch<Cart>(`/api/carts/${id.value}`, {
      method: 'GET',
    });

    setDataCart(response);
  }

  const updateStore = async (newStore: Store) => {
    try {
      const response = await sanctumFetch(`/api/carts/${id.value}/update-store`, {
        method: 'PUT',
        body: {
          store_id: newStore.id,
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      store.value = newStore;
    } catch (error) {

      console.error("Error actualizando el store:", error);
    }
  }

  const clearCart = () => {
    id.value = null;

    items.value = [];
    store.value = null;
    deliveryInfo.value = undefined;
    billingInfo.value = undefined;

    totals.items_total = {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    }
    totals.subtotal = {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    };
    totals.shipping = {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    };
    totals.taxes = {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    };
    totals.total = {
      amount: 0,
      decimal: 0.00,
      formatted: "S/ 0.00"
    };
  }

  return {
    id,
    currency,
    items,
    totals,
    deliveryInfo,
    billingInfo,
    setDataCart,
    fetchCart,
    addToCart,
    updateItem,
    deleteItem,
    totalQuantity,
    totalPrice,
    getCart,
    clearCart,
    hasStore,
    updateStore,
    store,
  };
}, {
  persist: {
    storage: import.meta.client ? localStorage : undefined,
    pick: ['id', 'currency', 'items', 'subtotal', 'store'],
    debug: true,
  },
});