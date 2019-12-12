import React from 'react';
import { useRoute, RouteElementProps } from './route';
import { getGotoHref } from './util/locate';
import { getRouteSwitchConfig, Route } from './util/route';
import { RouterConsumer } from './router';
import { getCurrentMicroAppName } from './util/global';

function NavLinkElement(props: RouteElementProps) {
  const { to, route,
    routeMatch, onRouteMatch, matchProps,
    children, locate, microAppName, routerType, basename, ...rest } = props;

  if (!React.isValidElement(children)) {
    throw new Error('Please pass React.Element to NavLink');
  }

  const gotoHref = getGotoHref({
    to,
    microAppName,
    routerType,
    basename,
  });
  const config = getRouteSwitchConfig(gotoHref, routerType);

  const [match, matchLocate] = useRoute(props);

  const comProps = match ? {
    ...rest,
    ...matchProps,
    match: matchLocate,
  } : rest;
  const component = React.cloneElement(children, comProps);

  return <a {...rest} {...config} href={gotoHref}>{component}</a>;
}

export interface NavLinkProps {
  to: Route;
  route?: Route;
  children: any;
  microAppName?: string;
}

export default function NavLink(props: NavLinkProps) {
  return (
    <RouterConsumer>
      {
        (routerConfig) => {
          return (
            <NavLinkElement
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
