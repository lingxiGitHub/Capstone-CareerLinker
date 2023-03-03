import LoginFormPage from "../LoginFormPage"
import SignupFormPage from "../SignupFormPage"
import SignupFormModal from "../SignupFormModal"
import "./Splash.css"


export default function Splash() {

    const splashSVG = (<img src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"></img>)
    return (
        <div className="splash-container">
            <div className="splash-container-left">
                <h1 className="welcome-word">Welcome to yourprofessional community</h1>
              

                <div><LoginFormPage /></div>
                {/* <p>Not a member?</p>
               <button>{SignupFormModal}</button> */}
            </div>
            <div className="splash-container-right">{splashSVG}</div>
        </div>
    )
}