/// <reference types="vite/client" />

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
