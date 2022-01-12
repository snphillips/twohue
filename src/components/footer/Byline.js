import React from "react";

export default function Byline(props) {
  return (
    <div className="byline">
      <a className="footer-link" href="https://sarahphillipsdev.surge.sh/">
        by Sarah Phillips{" "}
      </a>

      <a
        className="footer-link"
        href="https://github.com/snphillips/twohue-state-chart"
      >
        <i className="fa fa-github" aria-hidden="true"></i>
      </a>
    </div>
  );
}
