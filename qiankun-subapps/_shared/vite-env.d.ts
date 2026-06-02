/// <reference types="vite/client" />

/** 各子应用 vite.config 在 development 下注入的开发端口（可选 fallback） */
declare const __SUBAPP_DEV_PORT__: number | undefined;

/** 样式文件模块声明（CSS / SCSS / Sass） */
declare module '*.css' {
  const classes: string;
  export default classes;
}

declare module '*.scss' {
  const classes: string;
  export default classes;
}

declare module '*.sass' {
  const classes: string;
  export default classes;
}
