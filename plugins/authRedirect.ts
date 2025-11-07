export default defineNuxtPlugin(nuxtApp => {
    const { getLoginOrigin, clearLoginOrigin } = useLoginOrigin();
    const { toggleAuthDialog } = useUiStore();

    nuxtApp.hook('sanctum:login', () => {
        const origin = getLoginOrigin();
        
        setTimeout(() => {
            if (origin == 'dialog') {
                toggleAuthDialog();
                
                navigateTo('/checkout');
            } else {
                navigateTo('/dashboard');
            }
            clearLoginOrigin();
        }, 100);
    });
});