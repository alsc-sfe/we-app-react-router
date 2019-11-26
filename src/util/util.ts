export function isString(s: any) {
  return typeof s === 'string';
}

export function isObj(obj: any, type = '[object Object]') {
  return Object.prototype.toString.call(obj) === type;
}

export function isFunction(f: any) {
  return typeof f === 'function';
}

export function isBoolean(b: any) {
  return typeof b === 'boolean';
}

export function ajustPathname(pathname: string) {
  if (!isString(pathname)) {
    return pathname;
  }

  let newPath = pathname.replace(/\/{2,}/, '/');
  if (newPath !== '/' && newPath.slice(-1) === '/') {
    newPath = newPath.slice(0, newPath.length - 1);
  }
  return newPath;
}
