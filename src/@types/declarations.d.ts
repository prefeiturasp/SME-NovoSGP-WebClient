declare module '*.jpg';
declare module '*.png';
declare module '*.webp';
declare module '*.json' {
  const value: any;
  export default value;
}

// React 19 moved JSX types to React.JSX; libs not yet updated (ex: @types/styled-components@5)
// still rely on the global JSX namespace, que passou a vir vazio por padrão.
import type { JSX as ReactJSX, PointerEventHandler } from 'react';

declare module 'react' {
  // @ant-design/icons@5.0.1 tipa AntdIconProps com esses handlers (removidos no @types/react 19).
  // Sem isso, TS2739 em <InboxOutlined />, <SearchOutlined />, etc.
  interface DOMAttributes<T> {
    onPointerEnterCapture?: PointerEventHandler<T>;
    onPointerLeaveCapture?: PointerEventHandler<T>;
  }
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }

  namespace JSX {
    interface Element extends ReactJSX.Element {}
    interface ElementClass extends ReactJSX.ElementClass {}
    interface ElementAttributesProperty extends ReactJSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends ReactJSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends ReactJSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
  }
}
