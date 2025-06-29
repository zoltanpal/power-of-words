import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "@/pages/Loading";
import Layout from "@/components/layout";

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
const ExtremeDetection = lazy(() => import("@/pages/ExtremeDetection"));
const LiveAnalysisKeyword = lazy(() => import("@/pages/LiveAnalysisKeyword"));
const LiveAnalysisRss = lazy(() => import("@/pages/LiveAnalysisRss"));


export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="feeds" element={<Feeds />} />
          <Route path="trends" element={<Trends />} />
          <Route path="correlation_between_sources" element={<CorrelationBetweenSources />} />
          <Route path="bias_detection" element={<BiasDetection />} />
          <Route path="extreme_detection" element={<ExtremeDetection />} />
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