const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {

    import("web-vitals").then(
      ({
        getCLS,
        getFID,
        getFCP,
        getLCP,
        getTTFB,
      }) => {

        /* Core Web Vitals */

        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);

        /* Console Status */

        console.log(
          "%c Performance Monitoring Enabled ⚡",
          "color: #00e5ff; font-size: 14px; font-weight: bold;"
        );

      }
    );
  }
};

export default reportWebVitals;