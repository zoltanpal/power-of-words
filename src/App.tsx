import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "@/pages/Loading";
import Layout from "@/components/layout";
import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
}


/* Static pages */
const NotFound = lazy(() => import("@/pages/static/NotFound"));
const About = lazy(() => import("@/pages/static/About"));
const TechStack = lazy(() => import("@/pages/static/TechStack"));
const Contact = lazy(() => import("@/pages/static/Contact"));

/* Dynamic pages */
const Overview = lazy(() => import("@/pages/Overview"));
const Feeds = lazy(() => import("@/pages/Feeds"));
const Trends = lazy(() => import("@/pages/Trends"));
const CorrelationBetweenSources = lazy(() => import("@/pages/CorrelationBetweenSources"));
const BiasDetection = lazy(() => import("@/pages/BiasDetection"));
const RawDataViewer = lazy(() => import("@/pages/RawDataViewer"));
const WordCoOccurences = lazy(() => import("@/pages/WordCoOccurences"));
const LiveAnalysisKeyword = lazy(() => import("@/pages/LiveAnalysisKeyword"));
const LiveAnalysisRss = lazy(() => import("@/pages/LiveAnalysisRss"));



export default function App() {
  usePageTracking();
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="feeds" element={<Feeds />} />
          <Route path="trends" element={<Trends />} />
          <Route path="correlation_between_sources" element={<CorrelationBetweenSources />} />
          <Route path="bias_detection" element={<BiasDetection />} />
          <Route path="raw_data" element={<RawDataViewer />} />
          <Route path="word_co_occurences" element={<WordCoOccurences />} />
          <Route path="live_analysis_keyword" element={<LiveAnalysisKeyword />} />
          <Route path="live_analysis_rss" element={<LiveAnalysisRss />} />
          
          <Route path="about" element={<About />} />
          <Route path="tech_stack" element={<TechStack />} />
          <Route path="contact" element={<Contact />} />
        
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
} 