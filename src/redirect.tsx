import { RouterType } from './types';
import { RouterConsumer, RouterConfig } from './router';
import { getGotoHref, GetGotoHrefParams } from './util/locate';
import { Route } from './util/route';
import cem from '@saasfe/we-app-cem';

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
}

export default function Redirect(props: RedirectProps) {
  return (
    <RouterConsumer>
      {
        (routerConfig) => {
          return <RedirectElement {...props} {...routerConfig} />;
        }
      }
    </RouterConsumer>
  );
}

export const redirectTo = function (to: Route) {
  cem.trackShareDataOnce('router', (routerConfig: RouterConfig) => {
    if (routerConfig) {
      RedirectElement({
        to,
        ...routerConfig,
      });
    }
  });
};
