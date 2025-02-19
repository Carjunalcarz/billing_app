import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReportViewer to prevent SSR issues
const ReportViewer = dynamic(() => import("../components/ReportViewer"), {
  ssr: false, // Disable server-side rendering
});

const Home = () => {
  const [showReport, setShowReport] = useState(false);
  const viewerRef = useRef(null);
  const reportUri = "/reports/ac.rdlx-json";

  // Use effect to load the report once the component is mounted
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.Viewer.open(reportUri);
    }
  }, [reportUri]);

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={() => setShowReport(true)} style={{  fontSize: "16px" }}>
        Show Report
      </button>
      {showReport && <ReportViewer ref={viewerRef} reportUri={reportUri} />}
    </div>
  );
};

export default Home;
