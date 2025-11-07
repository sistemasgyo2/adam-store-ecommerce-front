<template>
  <div
    class="fixed w-screen h-screen bg-white/80 z-50 inset-0 overflow-hidden flex flex-col justify-center items-center space-y-4">
    <div class="flex flex-row gap-2">
      <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
      <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
      <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
    </div>
    <div class="text-center font-medium">
      <p>Estamos procesando tu pago.</p>
      <p>No cierres, ni actualices la página. Te redireccionaremos automáticamente</p>
    </div>

  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>