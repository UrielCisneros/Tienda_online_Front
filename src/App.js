import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import routes from './config/routes'
import {Helmet} from "react-helmet";

export default function App() {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Tienda Online</title>       
      </Helmet>
      <Router>
          <Switch>
            { routes.map((route, index) => (
              <RoutesWithSubRoutes key= {index} {...route} />
            ))}           
          </Switch>
      </Router>
    </div>
  );
}

function RoutesWithSubRoutes(route) {
  return (
    <Route 
      path={route.path}
      exact={route.exact}
      render={props => <route.component routes={route.routes} {...props}/>}
    />
  )
}

