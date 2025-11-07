<script setup lang="ts">
import { Loader2, TriangleAlert } from 'lucide-vue-next';
import { AlertDialog, AlertDialogContent, AlertDialogFooter } from './ui/alert-dialog';

defineProps({
    visible: Boolean,
    message: String,
    loading: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '¿Estás seguro?'
    },
    onConfirm: {
        type: Function as PropType<() => void>,
        required: true
    },
    onCancel: {
        type: Function as PropType<() => void>,
        required: false
    }
})
</script>
<template>
    <AlertDialog :open="visible">
        <AlertDialogContent>
            <div class="sm:flex sm:items-start">
                <div
                    class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <TriangleAlert class="text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-base font-semibold text-gray-900" id="modal-title">{{ title }}</h3>
                    <div class="mt-2">
                        <p class="text-sm text-gray-500">{{ message }}</p>
                    </div>
                </div>
            </div>
            <AlertDialogFooter>
                <Button type="button" @click="onCancel" variant="outline" :disabled="loading">Cancelar</Button>
                <Button type="button" @click="onConfirm" variant="destructive" :disabled="loading">
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                    Confirmar
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>