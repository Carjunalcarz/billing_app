import React, { useEffect, useRef } from "react";
import { Viewer } from "@mescius/activereportsjs-react";
import "@mescius/activereportsjs/pdfexport";
import "@mescius/activereportsjs/htmlexport";
import "@mescius/activereportsjs/tabulardataexport";
import "@mescius/activereportsjs-i18n";
import { FontStore } from "@mescius/activereportsjs/core";
import "@mescius/activereportsjs/styles/ar-js-ui.css";
import "@mescius/activereportsjs/styles/ar-js-viewer.css";

const ReportViewer = ({ reportUri }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.Viewer.open(reportUri);
    }
  }, [reportUri]);

  useEffect(() => {
    FontStore.registerFonts("/activereportsjs/demos/resource/fontsConfig.json");
  }, []);

  return (
    <div style={{ width: "100%", height: "400vh" }}>
      <Viewer ref={viewerRef} report={{ Uri: reportUri }} language="en"  />
    </div>
  );
};

export default ReportViewer;
