declare module '*.jpg';
declare module '*.png';
declare module '*.webp';
declare module '*.json' {
  const value: any;
  export default value;
}

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}
