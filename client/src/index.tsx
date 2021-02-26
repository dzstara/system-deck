import { lazy, StrictMode, Suspense } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import "style";

const Command = lazy(() => import("domains/Command"));

ReactDOM.render(
  <StrictMode>
    <Router>
      <Suspense fallback={"Loading page"}>
        <Switch>
          <Route exact path="/command" component={Command} />
        </Switch>
      </Suspense>
    </Router>
  </StrictMode>,
  document.getElementById("root")
);
