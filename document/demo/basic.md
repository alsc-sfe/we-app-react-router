---
order: 1
title: demo1
---

PC模板

````jsx
window.microAppName = 'common';
import { Router, Route, RouterType, redirectTo, Link, NavLink } from "@saasfe/we-app-react-router";

function routeChange() {
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('single-spa:routing-event'));
  }, 0);
}

function redirect(microAppName) {
  return () => {
    redirectTo('/', { microAppName });
    routeChange();
  };
}

function Nav(props) {
  return <span {...props}>Match '{props.path}'</span>;
}

class Demo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <>
      <Router routerType={RouterType.hash} basename="/xxx" microAppName="common">
        <p>
          <button onClick={routeChange}>触发Route更新</button>&nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={redirect('common')}>跳转到 '/xxx/common'</button>&nbsp;&nbsp;&nbsp;&nbsp;
        </p>

        <p>匹配 /xxx, /xxx/common, /xxx/common/home/123</p>
        <p>
          <Link to="~/home" microAppName="common" onClick={routeChange}>Goto '/xxx/home'</Link>&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/home/123" microAppName="common" onClick={routeChange}>Goto '/xxx/common/home/123'</Link>&nbsp;&nbsp;&nbsp;&nbsp;
        </p>

        <p>
          <NavLink to="/home" microAppName="common" onClick={routeChange} matchProps={{ style: { background: 'red', color: '#fff' } }}>
            <Nav path="/xxx/common/home" />
          </NavLink>
        </p>

        <Route route={[
          { path: '/', exact: true },
          '/home/:id', 
          { path: '~/', exact: true },
        ]} microAppName="common">
          <div style={{ color: 'red' }}>You can see me</div>
        </Route>
      </Router>

      <Router routerType={RouterType.hash} basename="/xxx" microAppName="org">
        <p>
          <button onClick={routeChange}>触发Route更新</button>&nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={redirect('org')}>跳转到 '/xxx/org'</button>&nbsp;&nbsp;&nbsp;&nbsp;
        </p>

        <p>匹配 /xxx, /xxx/org, /xxx/org/home/123</p>
        <p>
          <Link to="~/home" microAppName="org" onClick={routeChange}>Goto '/xxx/home'</Link>&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/home/123" microAppName="org" onClick={routeChange}>Goto '/xxx/org/home/123'</Link>&nbsp;&nbsp;&nbsp;&nbsp;
        </p>

        <p>
          <NavLink to="/home" microAppName="org" onClick={routeChange} matchProps={{ style: { background: 'red', color: '#fff' } }}>
            <Nav path="/xxx/org/home" />
          </NavLink>
        </p>

        <Route route={[
          { path: '/', exact: true },
          '/home/:id', 
          { path: '~/', exact: true },
        ]} microAppName="org">
          <div style={{ color: 'red' }}>You can see me</div>
        </Route>
      </Router>
      </>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
