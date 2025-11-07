export const useLoginOrigin = () => {
  const loginOrigin = useState('loginOrigin', () => null);

  const setLoginOrigin = (origin: any) => {
    loginOrigin.value = origin;
  };

  const getLoginOrigin = () => {
    return loginOrigin.value;
  };
  
  const clearLoginOrigin = () => {
    loginOrigin.value = null;
  };

  return {
    setLoginOrigin,
    getLoginOrigin,
    clearLoginOrigin
  };
}
