import r2wc from "react-to-webcomponent";
import React from "react";
import * as ReactDOM from "react-dom/client";

import App from "./App";

const HelloWC = r2wc(App, React, ReactDOM, {
  props: {
    name: "string"
  }
});

customElements.define("hello-wc", HelloWC);
