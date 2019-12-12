import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { parseLocate, Locate } from './util/locate';
import { DEFAULTRouteMatch, RouteMatch, Route as TRoute, RouteMatchParams } from './util/route';
import { getCurrentMicroAppName } from './util/global';
import { RouterType } from './types';
import { isFunction } from './util/util';
import { RouterConsumer } from './router';

export interface UseRouteParams extends RouteMatchParams {
  to?: TRoute;
  route?: TRoute;
  routeIgnore?: TRoute;
  routeMatch?: RouteMatch;
  onRouteMatch?: (params: Locate) => void;
}

// 优先按照route进行匹配，如果没有指定route，则使用to
export function useRoute({
  to, route, routeIgnore,
  routeMatch = DEFAULTRouteMatch,
  onRouteMatch,
  locate = window.location,
  microAppName,
  basename = '',
  routerType = RouterType.browser,
}: UseRouteParams) {
  const [currentRoute, changeCurrentRoute] = useState(window.location.href);
  // 将当前访问的路径和当前指定的路径进行匹配，判断是否匹配
  const routeRule = route || to;

  microAppName = getCurrentMicroAppName(microAppName);

  const match = useMemo(() => routeMatch({
    route: routeRule,
    routeIgnore,
    locate,
    microAppName,
    basename,
    routerType,
  }), [currentRoute]);

  const matchLocate = parseLocate({
    route: routeRule,
    locate,
    microAppName,
    basename,
    routerType,
  });

  useEffect(() => {
    if (match && isFunction(onRouteMatch)) {
      onRouteMatch(matchLocate);
    }
  }, [currentRoute]);

  const trackRouteChange = useCallback(() => {
    changeCurrentRoute(window.location.href);
  }, [changeCurrentRoute]);

  useEffect(() => {
    window.addEventListener('single-spa:routing-event', trackRouteChange);
    return () => {
      window.removeEventListener('single-spa:routing-event', trackRouteChange);
    };
  }, [trackRouteChange]);

  return [match, matchLocate];
}

export interface RouteElementProps extends UseRouteParams {
  children: any;
  matchProps?: object;
}

function RouteElement(props: RouteElementProps) {
  const { to, route, routeIgnore,
    routeMatch, onRouteMatch, matchProps, children,
    locate, microAppName, basename, routerType, ...rest } = props;

  if (!React.isValidElement(children)) {
    throw new Error('Please pass React.Element to Route');
  }

  const [match, matchLocate] = useRoute(props);

  if (!match) {
    return null;
  }

  const comProps = match ? {
    ...rest,
    ...matchProps,
    match: matchLocate,
  } : rest;
  const component = React.cloneElement(children, comProps);

  return component;
}

export interface RouteProps {
  route?: TRoute;
  routeIgnore?: TRoute;
  children: any;
  microAppName?: string;
  [prop: string]: any;
}

export default function Route(props: RouteProps) {
  return (
    <RouterConsumer>
      {
        (routerConfig) => {
          return (
            <RouteElement
              {...props}
              {...routerConfig}
              microAppName={getCurrentMicroAppName(props.microAppName)}
            />
          );
        }
      }
    </RouterConsumer>
  );
}
