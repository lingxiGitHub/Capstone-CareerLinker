import LoginFormPage from "../LoginFormPage";
import "./Splash.css";
import picture from "./downpic.png";
import photo1 from "./splah-photo-one.png";
import photo2 from "./splash-photo-two.png";

export default function Splash() {
  const splashSVG = (
    <img
      alt=""
      src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"
    ></img>
  );
  return (
    <div className="splash-container-container">
      <div className="splash-container">
        <div className="splash-container-left">
          <h1 className="welcome-word">
            Welcome to your professional community
          </h1>

          <div>
            <LoginFormPage />
          </div>
        </div>
        <div className="splash-container-right">{splashSVG}</div>
      </div>
      <div className="splash-down">
        <div className="two-image-container">
          <img alt="" className="down-one" src={photo1}></img>
          <img alt="" className="down-two" src={photo2}></img>
        </div>

        <img alt="" className="down-pic" src={picture}></img>
      </div>
    </div>
  );
}
