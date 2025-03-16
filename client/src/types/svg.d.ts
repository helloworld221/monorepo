/// <reference types="vite-plugin-svgr/client" />

declare module "*.svg" {
  import React, { SVGProps } from "react";

  export const ReactComponent: React.FC<SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}
