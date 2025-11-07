export default defineNuxtPlugin((nuxtApp) => {
    const ui = useUiStore()

    const handleResize = () => {
        if (window.innerWidth >= 768) {
            ui.closeAll()
        }
    }

    window.addEventListener('resize', handleResize)

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize)
    })
})