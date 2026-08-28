import { useEffect, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import { useTranslation } from "../locale/LocaleProvider";

const HERO_VIDEO_BY_LOCALE = {
  en: "0z0qm_XzecY",
  uk: "BQMxnvsz8eY",
};

const THUMB_QUALITIES = ["maxresdefault", "sddefault", "hqdefault"];

function HeroVideo() {
  const { locale, translate } = useTranslation();
  const videoId = HERO_VIDEO_BY_LOCALE[locale] ?? HERO_VIDEO_BY_LOCALE.en;
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbQualityIndex, setThumbQualityIndex] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setThumbQualityIndex(0);
  }, [videoId]);

  const thumbQuality = THUMB_QUALITIES[thumbQualityIndex] ?? "hqdefault";
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/${thumbQuality}.jpg`;
  const embedUrl =
    `https://www.youtube.com/embed/${videoId}`
    + "?autoplay=1&playsinline=1&rel=0&modestbranding=1&controls=1&fs=1&iv_load_policy=3";

  return (
    <RevealOnScroll className="hero-video">
      {isPlaying ? (
        <iframe
          title={translate("hero.iframeTitle")}
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          className="hero-video__preview"
          onClick={() => setIsPlaying(true)}
          aria-label={translate("hero.playVideo")}
        >
          <img
            className="hero-video__thumb"
            src={thumbnailUrl}
            alt=""
            decoding="async"
            onLoad={(event) => {
              // Missing maxresdefault returns a 120x90 JPEG with HTTP 404.
              // Browsers still paint it and may never fire onError.
              const { naturalWidth, naturalHeight } = event.currentTarget;
              if (naturalWidth <= 120 && naturalHeight <= 90) {
                setThumbQualityIndex((current) => (
                  current < THUMB_QUALITIES.length - 1 ? current + 1 : current
                ));
              }
            }}
            onError={() => {
              setThumbQualityIndex((current) => (
                current < THUMB_QUALITIES.length - 1 ? current + 1 : current
              ));
            }}
          />
          <span className="hero-video__shade" aria-hidden="true" />
          <span className="hero-video__play" aria-hidden="true">
            <span className="hero-video__play-icon" />
          </span>
        </button>
      )}
    </RevealOnScroll>
  );
}

export default HeroVideo;
