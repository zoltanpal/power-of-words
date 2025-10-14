import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

/**
 * Tracks pageviews whenever the route changes.
 * Should be rendered once inside <BrowserRouter>, ideally near the root.
 */
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null; // this component doesn't render anything visible
}
