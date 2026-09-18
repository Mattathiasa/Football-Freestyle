import React, { Suspense, useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HIGHLIGHTS } from '../../constants';
import { Highlight } from '../../types';
import FeaturedReel from './FeaturedReel';
import ArchiveGrid from './ArchiveGrid';
import { getFeaturedClips } from './featured';

const VideoPlayer = React.lazy(() => import('../VideoPlayer'));

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const VideoShowcase: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useState<Highlight | null>(null);
  const featured = useMemo(() => getFeaturedClips(HIGHLIGHTS), []);

  useEffect(() => {
    document.body.style.overflow = activeHighlight ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeHighlight]);

  // Re-measure pin/trigger positions once everything above (hero video poster,
  // fonts, thumbnails) has settled. The app mounts after the LoadingScreen, so
  // the window load event may have already fired.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      const raf = requestAnimationFrame(refresh);
      return () => cancelAnimationFrame(raf);
    }
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <section id="highlights" className="bg-obsidian relative overflow-x-clip">
      <FeaturedReel clips={featured} onOpen={setActiveHighlight} />
      <ArchiveGrid clips={HIGHLIGHTS} onOpen={setActiveHighlight} />

      {activeHighlight && (
        <Suspense fallback={null}>
          <VideoPlayer highlight={activeHighlight} onClose={() => setActiveHighlight(null)} />
        </Suspense>
      )}
    </section>
  );
};

export default VideoShowcase;
