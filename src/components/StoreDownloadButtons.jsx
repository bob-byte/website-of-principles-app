import { useEffect, useState } from "react";
import {
  ANDROID_STORE_URL,
  IOS_STORE_URL,
  STORE_DOWNLOAD_SECTION_ID,
} from "../config/storeLinks";
import { getStoreDisplayMode } from "../utils/mobilePlatform";
import { useTranslation } from "../locale/LocaleProvider";

function StoreDownloadButtons() {
  const { translate } = useTranslation();
  const [displayMode, setDisplayMode] = useState("web");

  useEffect(() => {
    const updateDisplayMode = () => {
      setDisplayMode(getStoreDisplayMode());
    };

    updateDisplayMode();
    window.addEventListener("resize", updateDisplayMode);
    return () => window.removeEventListener("resize", updateDisplayMode);
  }, []);

  return (
    <div
      id={STORE_DOWNLOAD_SECTION_ID}
      className={`store-download store-download--${displayMode}`}
    >
      <a
        href={ANDROID_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="store-download__btn store-download__btn--android"
      >
        {translate("stores.android")}
      </a>
      <a
        href={IOS_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="store-download__btn store-download__btn--ios"
      >
        {translate("stores.ios")}
      </a>
    </div>
  );
}

export default StoreDownloadButtons;
