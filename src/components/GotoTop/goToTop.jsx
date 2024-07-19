import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";

const GotoTop = () => {
  const [visible, setVisible] = useState(false);
  // console.log("Is visible:",visible);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 100) {
      setVisible(true);
    } else if (scrolled <= 100) {
      setVisible(false);
    }
  };

  const goTobtn = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("scroll", toggleVisible);
  return (
    <div className="flex justify-end items-center mb-3 mr-6">
      <div className="top-btn" onClick={goTobtn}>
        <i
          className="fa-regular fa-circle-up fa-2x"
          style={{ display: visible ? "inline" : "none" }}
        ></i>
      </div>
    </div>
  );
};

export default GotoTop;
