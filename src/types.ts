declare global {
  interface Window {
    MICRO_APPNAME: string;
  }
}

export enum RouterType {
  browser = '/',
  hash = '#/'
}
