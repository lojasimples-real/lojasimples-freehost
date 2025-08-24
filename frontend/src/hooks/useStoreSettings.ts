export const useStoreSettings = () => {
  const settings = JSON.parse(localStorage.getItem('storeSettings') || '{"storeName": "", "ownerName": "", "phone": ""}');
  return settings;
};