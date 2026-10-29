import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import Today from './pages/Today';
import Learn from './pages/Learn';
import LessonPage from './pages/Lesson';
import Practice from './pages/Practice';
import Algorithms from './pages/Algorithms';
import AlgorithmDetail from './pages/AlgorithmDetail';
import GuessPattern from './pages/GuessPattern';
import Concepts from './pages/Concepts';
import SystemDesign from './pages/SystemDesign';
import DesignDetail from './pages/DesignDetail';
import Behavioral from './pages/Behavioral';
import CustomCards from './pages/CustomCards';
import MockInterview from './pages/MockInterview';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Today />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:id" element={<LessonPage />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/algorithms" element={<Algorithms />} />
          <Route path="practice/algorithms/:id" element={<AlgorithmDetail />} />
          <Route path="practice/patterns" element={<GuessPattern />} />
          <Route path="practice/concepts" element={<Concepts />} />
          <Route path="practice/design" element={<SystemDesign />} />
          <Route path="practice/design/:id" element={<DesignDetail />} />
          <Route path="practice/behavioral" element={<Behavioral />} />
          <Route path="practice/custom" element={<CustomCards />} />
          <Route path="mock" element={<MockInterview />} />
          <Route path="stats" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
