import * as React from "react";
import { FC } from "react";
import { render } from "react-dom";

import { SpaceViewer } from "./SpaceViewer";

import "./style.css";

const App: FC = () => {
  return (
    <div style={{ padding: "0 1rem" }}>
      <h1>Hello world - React</h1>
      <p>
        This example demonstrates a basic integration of Smplrspace using the
        smplr-loader NPM package, providing a typed version of smplr.js
        automatically in your React app.
      </p>
      <p>
        <a href="https://docs.smplrspace.com" target="_blank" rel="noreferrer">
          Learn more in the docs
        </a>
      </p>
      <SpaceViewer />
    </div>
  );
};

render(<App />, document.getElementById("root"));
