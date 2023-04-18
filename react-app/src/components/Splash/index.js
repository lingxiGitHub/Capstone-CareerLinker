import LoginFormPage from "../LoginFormPage"
import SignupFormPage from "../SignupFormPage"
import SignupFormModal from "../SignupFormModal"
import "./Splash.css"
import { useDispatch } from "react-redux";
// import { login } from "../../store/session";
import { useModal } from "../../context/Modal";
import picture from "./downpic.png"


export default function Splash() {
    // const dispatch = useDispatch();
    // const { closeModal } = useModal();

    const splashSVG = (<img src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"></img>)
    return (
        <>
        <div className="splash-container">
            <div className="splash-container-left">
                <h1 className="welcome-word">Welcome to yourprofessional community</h1>
              

                <div><LoginFormPage /></div>
              
            </div>
            <div className="splash-container-right">{splashSVG}</div>
        </div>
        <div className="splash-down">
            <img className="down-pic" src = {picture}></img>
        </div>
        </>
    )
}