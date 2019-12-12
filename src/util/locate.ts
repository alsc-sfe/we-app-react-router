import { RouterType } from '../types';
import { getCurrentMicroAppName } from './global';
import { parseRouteParams, Route, RouteObj, isAbsolutePathname } from './route';
import { isObj, isString, ajustPathname } from './util';

// 路径由basename+微应用名称+页面路径，三部分构成
export function getPathnamePrefix({ microAppName, basename = '', absolute = false }) {
  if (absolute) {
    return ajustPathname(`/${basename}`);
  }
  return ajustPathname(`/${basename}/${getCurrentMicroAppName(microAppName)}`);
}

export type Locate = string | Location | WeAppLocation;

export class WeAppLocation {
  routerType: RouterType;

  microAppName: string;

  pathname: string;

  basename: string;

  search: string;

  query: object;

  params: object;

  constructor(loc: Locate) {
    Object.keys(loc).forEach(k => {
      this[k] = loc[k];
    });
  }
}

export interface ParseLocationParams {
  locate: Locate;
  routerType: RouterType;
  basename: string;
  microAppName: string;
  route?: Route;
  [prop: string]: any;
}

// 将路径解析为Location对象
export function parseLocate({
  locate = window.location,
  routerType = RouterType.browser,
  microAppName,
  basename = '',
  route,
}: ParseLocationParams) {
  if (locate instanceof WeAppLocation) {
    return locate;
  }

  microAppName = getCurrentMicroAppName(microAppName);

  const defaultPathname = basename || '/';

  let locStr: string;
  let loc: WeAppLocation;

  if (isObj(locate, '[object Location]') || isObj(locate)) {
    if (routerType === RouterType.browser) {
      loc = new WeAppLocation({
        routerType,
        microAppName,
        basename,
        pathname: (locate as Location).pathname,
        search: locate.search as string,
        query: {},
        params: {},
      });

      loc.query = parseQuery({
        locate: loc,
        routerType,
        microAppName,
        basename,
      });

      if (route) {
        loc.params = parseRouteParams({
          route,
          locate,
          microAppName,
          basename,
          routerType,
        });
      }

      return loc;
    }

    // 路由hash模式下，取hash，或者为默认地址
    locStr = (locate as Location).hash || `#${defaultPathname}`;
  }

  if (isString(locate)) {
    locStr = locate as string;
  }

  loc = new WeAppLocation({
    routerType,
    microAppName,
    basename,
    pathname: defaultPathname,
    search: '',
    query: {},
    params: {},
  });

  locStr = locStr.replace('#', '');
  const match = /^([^?]*)(\?[^?]*)?/g.exec(locStr);
  if (match) {
    loc = new WeAppLocation({
      routerType,
      microAppName,
      basename,
      pathname: match[1],
      search: match[2] || '',
      query: {},
      params: {},
    });
  }

  loc.query = parseQuery({
    locate: loc,
    routerType,
    microAppName,
    basename,
  });

  if (route) {
    loc.params = parseRouteParams({
      route,
      locate,
      microAppName,
      basename,
      routerType,
    });
  }

  return loc;
}

export function parseQuery({
  locate = window.location,
  routerType = RouterType.browser,
  microAppName,
  basename = '',
}: ParseLocationParams) {
  microAppName = getCurrentMicroAppName(microAppName);

  const { search } = parseLocate({
    locate,
    routerType,
    microAppName,
    basename,
  });

  const query = {};
  if (search) {
    search.slice(1).split('&').forEach(q => {
      const pair = q.split('=');
      query[pair[0]] = decodeURIComponent(pair[1] || '');
    });
  }

  return query;
}

export interface GetGotoPathnameParams {
  to: Route;
  microAppName: string;
  basename: string;
}

export function getGotoPathname({
  to,
  microAppName,
  basename = '',
}: GetGotoPathnameParams) {
  let link = to.toString();

  microAppName = getCurrentMicroAppName(microAppName);

  if (isObj(to)) {
    const { path, query } = to as RouteObj;
    link = path;

    let search: string | object = query;
    if (isObj(query)) {
      const params = Object.keys(query).map(k => `${k}=${encodeURIComponent(query[k] || '')}`);
      search = params.join('&');
    }
    if (search) {
      link = `${path}?${search}`.replace('??', '?');
    }
  }

  const absolute = isAbsolutePathname(link);

  if (absolute) {
    link = link.slice(1);
  }

  let gotoPathname = link;
  // 应用内路径指定为/时，自动去除，以便于路径匹配，
  // href /org 可以匹配 pathname /org/
  // href /org/ 无法匹配 pathname /org
  const pathnamePrefix = getPathnamePrefix({ microAppName, basename, absolute });
  gotoPathname = ajustPathname(`${pathnamePrefix}${link === '/' ? '' : link}`);

  return gotoPathname;
}

export interface GetGotoHrefParams {
  to: Route;
  microAppName: string;
  routerType: RouterType;
  basename: string;
}
// 返回带routerType的href
export function getGotoHref({
  to,
  microAppName,
  routerType = RouterType.browser,
  basename = '',
}: GetGotoHrefParams) {
  const gotoPathname = getGotoPathname({
    to,
    microAppName: getCurrentMicroAppName(microAppName),
    basename,
  });
  const gotoHref = ajustPathname(`${routerType}${gotoPathname}`);

  return gotoHref;
}
