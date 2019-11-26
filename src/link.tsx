import React from 'react';
import { getGotoHref, GetGotoHrefParams } from './util/locate';
import { getRouteSwitchConfig, Route } from './util/route';
import { RouterConsumer, RouterConfig } from './router';

interface LinkElementProps extends GetGotoHrefParams {
  children: any;
}

function LinkElement({ to, microAppName, basename, routerType, children, ...rest }: LinkElementProps) {
  const gotoHref = getGotoHref({
    to,
    microAppName,
    basename,
    routerType,
  });
  const config = getRouteSwitchConfig(gotoHref, routerType);

  return <a {...rest} {...config} href={gotoHref}>{children}</a>;
}

export interface LinkProps {
  to: Route;
  children: any;
}

export default function Link(props: LinkProps) {
  return (
    <RouterConsumer>
      {
        (routerConfig) => {
          return <LinkElement {...props} {...routerConfig} />;
        }
      }
    </RouterConsumer>
  );
}
