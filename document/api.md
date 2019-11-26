---
title: 微应用路由
subtitle: We App Router
cols: 2
---

## API

微应用路由主要提供的能力有两部分，

1. 组件。包括链接(Link)、导航链接(NavLink)、跳转(Redirect)。
2. 辅助功能。获取查询参数(getSearchParams)，路由类型(routerType)，路由枚举(RouterType)，微应用名称(microAppName)。

**微应用的路由与常规路由有些差异**

1. 在微应用内部，按照常规的应用路由的写法来，如微应用org，管理组织的路由为/manage/org，管理角色的路由为/manage/role，这种路径称为**微应用内路径**
2. 微应用在运行时，路由会有所变化，会将微应用名称作为路由的第一级，还是上面的例子，管理组织的实际路由为/org/manage/org，这种路径称为**绝对路径**

路由的几种写法，假设微应用为`common`，`basename`为`/xxx`

1. true, 始终匹配
2. /home/:id, 匹配 /xxx/common/home/123
3. /home, 匹配以 /xxx/common/home 开头的路径，需要完全匹配，需配置exact为true，参照react-router
4. ~/user/home/:id, 匹配的是 /xxx/user/home/123，~标识从basename开始
5. { path: '/home', exact: true, strict: true }, exact、strict 参照react-router

另外，为了保持使用习惯，API的设计大体上参照react-router的API。

所以，**路由必须以/开头**。

**请确保构建工具会注入微应用名称MICRO_APPNAME**，如webpack通过definePlugin注入MICRO_APPNAME。

### Link

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| to        | 链接，**必须以/开头**，建议使用微应用内路径，如/detail或者{path: '/detail', query: 'id=1&new=1'}或者{path: '/detail', query: {id:1,new:1}} | String/Object   | 无 |
| children        | 子节点 | React.children   | 无 |

### Route

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| to        | 链接，建议使用微应用内路径，如/detail或者{path: '/detail', query: 'id=1&new=1'}或者{path: '/detail', query: {id: 1, new: 1} | String/Object   | 无 |
| exact       | 是否完全匹配 | Boolean   | false |
| strict       | 是否末尾无/ | Boolean   | false |
| route | 路由匹配规则，基于path-to-regexp | String/String[] | 无
| routeIgnore | 路由反向匹配规则，除指定的路由外都匹配 | String/String[] | 无
| routeMatch       | 路径匹配函数，用于确定当前路径是否匹配 | Function   | 内置匹配函数 |
| onRouteMatch       | 路径匹配时的回调，入参为当前匹配的路径对象，含pathname、params、query等 | Function   | 无 |
| matchProps       | 路径匹配时向children注入的props，默认会传入match，一般传className即可 | Object   | { match: true/false } |
| children        | 子组件 | React.Element，props中注入match，即当前匹配的路径对象，含pathname、params、query等   | 无 |

### NavLink

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| to        | 链接，建议使用微应用内路径，如/detail或者{path: '/detail', query: 'id=1&new=1'}或者{path: '/detail', query: {id: 1, new: 1} | String/Object   | 无 |
| exact       | 是否完全匹配 | Boolean   | false |
| strict       | 是否末尾无/ | Boolean   | false |
| route | 路由匹配规则，基于path-to-regexp | String/String[] | 无
| routeMatch       | 路径匹配函数，用于确定当前路径是否匹配 | Function   | 内置匹配函数 |
| onRouteMatch       | 路径匹配时的回调，入参为当前匹配的路径对象，含pathname、params、query等 | Function   | 无 |
| matchProps       | 路径匹配时向children注入的props，默认会传入match，一般传className即可 | Object   | { match: true/false } |
| children        | 子组件 | React.Element，props中注入match，即当前匹配的路径对象，含pathname、params、query等   | 无 |

### Redirect

可当做React Component使用，或者当做函数调用，如

```
<Redirect to="" />

redirectTo('/');
```

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| to        | 链接，建议使用微应用内路径，如/detail或者{path: '/detail', query: 'id=1&new=1'}或者{path: '/detail', query: {id: 1, new: 1} | String/Object   | 无 |
