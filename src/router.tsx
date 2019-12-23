import React from 'react';
import { createContext } from '@saasfe/we-app-cem';
import { RouterType } from './types';

export interface RouterConfig {
  basename: string;
  microAppName: string;
  routerType: RouterType;
}

export interface RouterProps extends RouterConfig {
  children: any;
  [prop: string]: any;
}

const { Provider, Consumer, consume } = createContext(null, 'router', true);

export default function Router(props: RouterProps) {
  const { children, ...restProps } = props;

  return (
    <Provider value={restProps}>{children}</Provider>
  );
}

export interface RouterConsumerProps {
  children: (params: RouterConfig) => React.ReactElement;
  [prop: string]: any;
}

/**
 * Context需要在一个上下文中，而loader和模块处于两个上下文中，
 * 所以需要使用cem替代React.Context，达到数据共享
 */
export function RouterConsumer(props: RouterConsumerProps) {
  const { children } = props;

  return (
    <Consumer>
      {
        (routerConfig: RouterConfig) => {
          if (!routerConfig) {
            return null;
          }

          return children(routerConfig);
        }
      }
    </Consumer>
  );
}

export {
  consume as routerConsume,
};
