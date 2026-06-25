import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      const main = document.getElementById("main-content");
      if (main) main.focus({ preventScroll: true });
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
