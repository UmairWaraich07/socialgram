import { lazy, LazyExoticComponent } from "react";

export const lazyLoad = (
  path: string,
  namedExports: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): LazyExoticComponent<any> => {
  return lazy(() => {
    const promise = import(path);

    return promise.then((module) => ({ default: module[namedExports] }));
  });
};
