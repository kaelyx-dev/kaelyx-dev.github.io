export function gtag(...args){
  if (typeof window !== 'undefined' && window.gtag) window.gtag(...args);
  return
}