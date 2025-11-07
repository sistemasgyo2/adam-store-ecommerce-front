export default defineNuxtPlugin(() => {
    // Carga el script de Culqi
    const script = document.createElement('script');
    script.src = 'https://checkout.culqi.com/js/v4';
    script.onload = () => {
        const runtimeConfig = useRuntimeConfig();
        Culqi.publicKey = runtimeConfig.public.culqiPublicKey;
        Culqi.options({
            lang: "es",
            installments: false,
            paymentMethods: {
                tarjeta: true,
                yape: true,
            },
            style: {
                logo: "https://www.portatilesyredes.com/_nuxt/logo_pyr.VlPoR7F4.png",
            }
        });
    };
    document.head.appendChild(script);
});