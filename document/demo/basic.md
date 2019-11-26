---
order: 1
title: demo1
---

PC模板

````jsx
import { Router, Route, RouterType, redirectTo, Link, NavLink } from "@saasfe/we-app-react-router";

function routeChange() {
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('single-spa:routing-event'));
  }, 0);
}

function redirect() {
  redirectTo('/');
  routeChange();
}

function Nav(props) {
  return <span {...props}>Match '/xxx/common/home'</span>;
}

class Demo extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <Router routerType={RouterType.hash} basename="/xxx" microAppName="common">
        <p>
          <button onClick={routeChange}>触发Route更新</button>&nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={redirect}>跳转到 '/xxx/common'</button>&nbsp;&nbsp;&nbsp;&nbsp;
        </p>

        <p>匹配 /xxx, /xxx/common, /xxx/common/home/123</p>
        <p>
          <Link to="~/home" onClick={routeChange}>Goto '/xxx/home'</Link>&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/home/123" onClick={routeChange}>Goto '/xxx/common/home/123'</Link>&nbsp;&nbsp;&nbsp;&nbsp;
        </p>

        <p>
          <NavLink to="/home" onClick={routeChange} matchProps={{ style: { background: 'red', color: '#fff' } }}>
            <Nav />
          </NavLink>
        </p>

        <Route route={[
          { path: '/', exact: true },
          '/home/:id', 
          { path: '~/', exact: true },
        ]}>
          <div style={{ color: 'red' }}>You can see me</div>
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
````
