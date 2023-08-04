import { useState } from "react";

export default function NewsRight() {
  const [showLess, setShowLess] = useState(true);

  const arrowDownSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      data-supported-dps="16x16"
      fill="currentColor"
      class="mercado-match"
      width="16"
      height="16"
      focusable="false"
    >
      <path d="M1 5l7 4.61L15 5v2.39L8 12 1 7.39z"></path>
    </svg>
  );

  const arrowUpSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      data-supported-dps="16x16"
      fill="currentColor"
      class="mercado-match"
      width="16"
      height="16"
      focusable="false"
    >
      <path d="M15 11L8 6.39 1 11V8.61L8 4l7 4.61z"></path>
    </svg>
  );

  const littleLinkedinSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      data-supported-dps="24x24"
      fill="rgb(10,102,194)"
      class="mercado-match"
      width="14"
      height="14"
      focusable="false"
    >
      <path d="M 20.5 2 L 3.5 2 C 2.672 2 2 2.672 2 3.5 L 2 20.5 C 2 21.328 2.672 22 3.5 22 L 20.5 22 C 21.328 22 22 21.328 22 20.5 L 22 3.5 C 22 2.672 21.328 2 20.5 2 Z M 8 19 L 5 19 L 5.08 4.775 L 8.059 4.768 L 8 19 Z M 19 19 L 16 19 L 16 14.26 C 16 12.84 15.4 12.33 14.62 12.33 C 13.658 12.394 12.931 13.228 13 14.19 C 12.995 14.237 12.995 14.283 13 14.33 L 13 19 L 10 19 L 10 10 L 12.9 10 L 12.9 11.3 C 13.495 10.395 14.518 9.865 15.6 9.9 C 17.15 9.9 18.96 10.76 18.96 13.56 L 19 19 Z"></path>
    </svg>
  );
  return (
    <div className="right-right">
      <div className="home-right">
        <div className={`${showLess ? "show-less" : "show-more"}`}>
          <div className="linkedin-news">Linkedin News</div>
          <div className="news-bold"> ◦ JPMorgan embraces Florida, Texas</div>
          <div className="news-slim">6h ago · 121,043 readers</div>
          <div className="news-bold">◦ FTC digs deeper into Twitter</div>
          <div className="news-slim">4h ago · 78,080 readers</div>
          <div className="news-bold">◦ Payrolls jumped recently: ADP</div>
          <div className="news-slim">6h ago · 31,045 readers</div>
          <div className="news-bold">
            ◦ New vaccine proves effective against Delta
          </div>
          <div className="news-slim">6h ago · 21,542 readers</div>
          <div className="news-bold">◦ Apple unveils latest iPhone model</div>
          <div className="news-slim">6h ago · 19,031 readers</div>
          <div className="news-bold">
            ◦ New study links coffee to longer lifespan
          </div>
          <div className="news-slim">6h ago · 17,983 readers</div>
          <div className="news-bold">
            ◦ NASA to launch new Mars rover mission
          </div>
          <div className="news-slim">6h ago · 5,728 readers</div>
          <div className="news-bold">
            ◦ World Leaders Meet to Discuss Climate Crisis
          </div>
          <div className="news-slim">6h ago · 2,333 readers</div>
          <div className="news-bold">◦ SpaceX Launches Mission to Mars</div>
          <div className="news-slim">6h ago · 1,003 readers</div>
          <div className="news-bold">◦ China's Economy Continues to Grow</div>
          <div className="news-slim">6h ago · 566 readers</div>
        </div>
        <button
          className="show-less-news"
          onClick={(e) => setShowLess(!showLess)}
        >
          {showLess ? (
            <span className="show-arrow">Show More {arrowDownSVG}</span>
          ) : (
            <span className="show-arrow">Show Less {arrowUpSVG}</span>
          )}
        </button>
      </div>
      <div>
        <ul className="about-section">
          <li>
            <span>
              <a className="about-a" href="https://about.linkedin.com/">
                About
              </a>
            </span>
          </li>
          <li>
            <span>
              <a
                className="about-a"
                href="https://www.linkedin.com/accessibility"
              >
                Accessibility
              </a>
            </span>
          </li>
          <li>
            <span>
              <a
                className="about-a"
                href="https://www.linkedin.com//help/linkedin?trk=footer_d_flagship3_feed"
              >
                Help Center
              </a>
            </span>
          </li>
          <li>
            <span>
              <a
                className="about-a"
                href="https://www.linkedin.com/legal/privacy-policy"
              >
                Privacy & Terms
              </a>
            </span>
          </li>
          <li>
            <span>
              <a
                className="about-a"
                href="https://www.linkedin.com/help/linkedin/answer/a1342443"
              >
                Ad Choices
              </a>
            </span>
          </li>
          <li>
            <span>
              <a
                className="about-a"
                href="https://business.linkedin.com/marketing-solutions/ads?trk=n_nav_ads_rr_b&src=li-nav&veh=ad%2Fstart"
              >
                Advertising
              </a>
            </span>
          </li>
          <li>
            <span>
              <a
                className="about-a"
                href="https://business.linkedin.com/talent-solutions?trk=flagship_nav&veh=li-header-dropdown-lts-control&src=li-nav"
              >
                Business Services
              </a>
            </span>
          </li>
          <li>
            <span>
              <a
                className="about-a"
                href="https://apps.apple.com/us/app/id288429040"
              >
                Get the Linkedin app
              </a>
            </span>
          </li>
        </ul>

        <div className="footer-linkedin-small">
          {littleLinkedinSVG}

          <span className="corp">CareerLinker Corporation 2023</span>
        </div>
      </div>
    </div>
  );
}
