import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Command from "domains/Command/components";
import SoundBoard from "domains/SoundBoard";
import "style";

ReactDOM.render(
  <StrictMode>
    <Router>
      <Switch>
        <Route path="/command" component={Command} />
        <Route exact path="/soundboard" component={SoundBoard} />
      </Switch>
    </Router>
  </StrictMode>,
  document.getElementById("root")
);
