import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const isMenuOpen = ref(false);
  const isCartOpen = ref(false);
  const isAuthDialogShow = ref(false);

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }

  function closeAll() {
    isMenuOpen.value = false
    isCartOpen.value = false
  }

  function toggleAuthDialog() {
    isAuthDialogShow.value = !isAuthDialogShow.value;
  }

  return {
    isMenuOpen,
    isCartOpen,
    isAuthDialogShow,
    toggleMenu,
    toggleCart,
    closeAll,
    toggleAuthDialog,
  }
});