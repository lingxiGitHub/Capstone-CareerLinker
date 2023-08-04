import "./NotFound.css";
import notFoundImg from "./404.png";
import { useHistory } from "react-router-dom";

export default function NotFound() {
  const history = useHistory();

  return (
    <div className="not-found-container">
      <h1>Page not Found</h1>
      <p className="not-found-p">
        Uh oh, we can’t seem to find the page you’re looking for. Try going back
        to the previous page or see our{" "}
        <span>
          <a
            href="https://www.linkedin.com/help/linkedin?trk=404_page"
            target="_blank"
            rel="noreferrer"
          >
            Help Center
          </a>
        </span>
        for more information
      </p>
      <button
        className="go-to-feed-button"
        onClick={() => history.push(`/home`)}
      >
        Go to your feed
      </button>
      <img src={notFoundImg} alt=""></img>
    </div>
  );
}
