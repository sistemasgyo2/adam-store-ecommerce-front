import { FetchError } from 'ofetch';

const VALIDATION_ERROR_CODE = 422
const UNAUTHORIZED_CODE = 401
const SERVER_ERROR_CODE = 500

export function useSanctumError<TFields extends string = string>(error: unknown) {
  const isFetchError = error instanceof FetchError
  const code = isFetchError ? error.response?.status ?? SERVER_ERROR_CODE : SERVER_ERROR_CODE

  const isValidationError = isFetchError && code === VALIDATION_ERROR_CODE
  const isUnauthorized = isFetchError && code === UNAUTHORIZED_CODE

  const fieldErrors = isValidationError
    ? (Object.fromEntries(
        Object.entries(error.response?._data.errors ?? {}).map(([key, messages]) => [
          key,
          messages[0] ?? 'Error desconocido',
        ])
      ) as Partial<Record<TFields, string>>)
    : {}

  const generalMessage = isValidationError
    ? undefined
    : isUnauthorized
      ? 'Credenciales inválidas'
      : isFetchError
        ? error.response?._data?.message || 'Ocurrió un error inesperado'
        : 'Error desconocido'

  return {
    code,
    isValidationError,
    isUnauthorized,
    fieldErrors,
    generalMessage,
  }
}
