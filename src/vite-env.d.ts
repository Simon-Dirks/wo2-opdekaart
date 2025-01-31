/// <reference types="vite/client" />
interface ImportMetaEnv {
  // readonly VITE_TRIPLY_TOKEN: string
  readonly VITE_RESULTS_PER_PAGE: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
