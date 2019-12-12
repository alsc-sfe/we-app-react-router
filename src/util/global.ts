window.MICRO_APPNAME = window.MICRO_APPNAME || '';

export function getCurrentMicroAppName(microAppName: string) {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const currentMicroAppName: string = MICRO_APPNAME; // 在微应用中会由构建工具注入，而在loader中需要外部传入

  return microAppName || currentMicroAppName || window.MICRO_APPNAME;
}
