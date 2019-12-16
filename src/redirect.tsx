import cem from '@saasfe/we-app-cem';
import { RouterType } from './types';
import { RouterConsumer, RouterConfig } from './router';
import { getGotoHref, GetGotoHrefParams } from './util/locate';
import { Route } from './util/route';
import { getCurrentMicroAppName } from './util/global';

function RedirectElement(props: GetGotoHrefParams) {
  const { routerType } = props;

  const gotoHref = getGotoHref(props);

  if (routerType === RouterType.hash) {
    location.hash = gotoHref;
  } else {
    history.pushState(null, null, gotoHref);
  }

  return null;
}

export interface RedirectProps {
  to: Route;
  microAppName?: string;
}

export default function Redirect(props: RedirectProps) {
  return (
    <RouterConsumer>
      {
        (routerConfig) => {
          return (
            <RedirectElement
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

export const redirectTo = function (to: Route, opts?: { microAppName?: string } | undefined) {
  const { microAppName } = opts || {};
  cem.trackShareDataOnce(Symbol.for('router'), (routerConfig: RouterConfig) => {
    if (routerConfig) {
      RedirectElement({
        to,
        ...routerConfig,
        microAppName: getCurrentMicroAppName(microAppName),
      });
    }
  });
};
