import React, { useState, useEffect } from 'react';
import cem from '@saasfe/we-app-cem';
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

export default function Router(props: RouterProps) {
  const { children, ...restProps } = props;

  cem.shareData({
    router: restProps,
  });

  return children;
}

/**
 * Context需要在一个上下文中，而loader和模块处于两个上下文中，
 * 所以需要使用cem替代React.Context，达到数据共享
 */
export function RouterConsumer(props: { children: (params: RouterConfig) => React.ReactElement }) {
  const { children } = props;

  const [routerConfig, setRouterConfig] = useState(null);

  useEffect(() => {
    cem.trackShareDataOnce('router', (rc: RouterConfig) => {
      if (rc) {
        setRouterConfig(rc);
      }
    });
  }, []);

  if (!routerConfig) {
    return null;
  }

  return children(routerConfig);
}
