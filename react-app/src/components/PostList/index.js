import "./PostList.css"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react"
import { getAllPosts } from "../../store/post";
import { getAllComments } from "../../store/comment";
import Post from "../Post";
import AddPostModal from "../AddPostModal"
import OpenModalButton from "../OpenModalButton"
import { getAllLikes } from "../../store/like";
import { getAllConnections } from "../../store/connection";
import banner from "./banner-photo.webp"


function PostList() {
    const [showLess, setShowLess] = useState(true);
    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser)

    const allPostsObj = useSelector((state) => {
        return state.posts.allPosts
    })

    const allPosts = allPostsObj ? Object.values(allPostsObj) : []

    const allConnectionsObj = useSelector((state) => {
        return state.connections.allConnections
    })

    const allConnections = allConnectionsObj ? Object.values(allConnectionsObj) : []

    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch()
    useEffect(async () => {
        await dispatch(getAllPosts())
        await dispatch(getAllComments())
        await dispatch(getAllLikes())
        await dispatch(getAllConnections())
        setIsLoaded(true)

    }, [dispatch])


    const arrowDownSVG = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
        <path d="M1 5l7 4.61L15 5v2.39L8 12 1 7.39z"></path>
    </svg>)

    const arrowUpSVG = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
        <path d="M15 11L8 6.39 1 11V8.61L8 4l7 4.61z"></path>
    </svg>)

    const littleLinkedinSVG = (
        <svg className="little-linkedin" viewBox="0 0 128 128">
            <path fill="#0076b2" d="M116 3H12a8.91 8.91 0 00-9 8.8v104.42a8.91 8.91 0 009 8.78h104a8.93 8.93 0 009-8.81V11.77A8.93 8.93 0 00116 3z"></path><path fill="#fff" d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 11-10.5 10.49 10.5 10.5 0 0110.5-10.49M50.53 48.73h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z"></path>
        </svg>
          )

          const premiumSVG=(
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 16" data-supported-dps="64x8" width="64" height="8" focusable="false">
                  <path d="M0 15.696h2.784v-5.76H5.28c3.36 0 5.952-1.608 5.952-5.088C11.232 1.2 8.712 0 5.28 0H0v15.696zm2.784-7.992V2.232H5.04c2.28 0 3.456.648 3.456 2.616 0 1.92-1.104 2.856-3.456 2.856H2.784zm18.112-5.472h2.208c2.16 0 3.312.624 3.312 2.424 0 1.776-1.152 2.688-3.312 2.688h-2.208V2.232zm8.88 13.464l-3.744-6.552c1.896-.648 3.144-2.088 3.144-4.488 0-3.504-2.52-4.656-5.784-4.656h-5.28v15.696h2.784V9.552h2.376l3.384 6.144h3.12zm6.64 0h9.672v-2.352H39.2V8.712h5.64V6.36H39.2V2.352h6.648V0h-9.432v15.696zm16.816 0h2.544V8.52c0-1.464-.216-3.552-.336-4.992h.096l1.248 3.576 2.712 7.128h1.272l2.712-7.128 1.272-3.576h.096c-.144 1.44-.36 3.528-.36 4.992v7.176h2.616V0h-3.072l-2.76 7.728-1.032 2.976h-.096l-1.032-2.976L56.28 0h-3.048v15.696zm21.808 0h2.784V0H75.04v15.696zm10.6-6.888c0 5.16 2.328 7.176 5.976 7.176 3.624 0 5.928-2.016 5.928-7.176V0h-2.688v9.024c0 3.408-1.32 4.536-3.24 4.536-1.896 0-3.192-1.128-3.192-4.536V0H85.64v8.808zm19.744 6.888h2.544V8.52c0-1.464-.216-3.552-.336-4.992h.096l1.248 3.576 2.712 7.128h1.272l2.712-7.128 1.272-3.576H117c-.144 1.44-.36 3.528-.36 4.992v7.176h2.616V0h-3.072l-2.76 7.728-1.032 2.976h-.096l-1.032-2.976L108.432 0h-3.048v15.696z" fill="#fff" opacity=".85"></path>
              </svg>
          )


    return (
        isLoaded && (


            <div className="home-post-container">
                {/* <Helmet>
                    <link rel="stylesheet" href="path/to/your/stylesheet.css" />
                </Helmet> */}

                {sessionUser && (
                    <div className="left-card">
                        <div className="premium">{premiumSVG}</div>
                        <img className="banner" src={banner} alt=""></img>
                        <img className="profile-photo-72" src={sessionUser.profile_photo} alt=""></img>
                        <div className="left-card-name">{sessionUser.first_name} {sessionUser.last_name}</div>
                        <div className="left-card-title">{sessionUser.title}</div>
                        {/* <div className="connection-count">
                            <div className="left-card-connections">Connections</div>
                            <div>Num</div> */}
                        {/* </div> */}
                        <hr className="left-card-line"></hr>
                        <div className="left-card-span"><span className="span-one">Who's viewed your profile</span><span className="span-two">63</span></div>
                        <div className="left-card-span">
                            <span className="span-one">Connections</span>
                            {/* <span className="span-two">{allConnections.length}</span> */}
                            <a className="span-two" href="/mynetwork">{allConnections.length}</a>
                        </div>
                        <hr className="left-card-line"></hr>
                        <div className="premium-features">See your Premium features</div>
                        <hr className="left-card-line"></hr>
                    </div>
                )}


                <div className="home-middle">
                    <div className="create-post-container">
                        {sessionUser && (
                            <div className="create-post-section">

                                <img className="profile-photo" src={sessionUser.profile_photo} alt=""></img>
                                <OpenModalButton
                                    className="start-a-post-button"
                                    buttonText="Start a post"
                                    modalComponent={<AddPostModal />}
                                />

                            </div>
                        )}

                    </div>
                    <hr className="the-line"></hr>
                    <ul className="post-main-ul">
                        {
                            allPosts.reverse().map(post => {
                                // console.log("post has id?",post)
                                return (

                                    <li key={post.post_id}>
                                        <Post post={post} />
                                    </li>
                                )

                            })
                        }
                    </ul>
                </div>
                <div className="right-right">
                    <div className="home-right" >
                        <div className={`${showLess ? "show-less" : ""}`}>
                            <div className="linkedin-news">Linkedin News</div>
                            <div className="news-bold"> ◦ JPMorgan embraces Florida, Texas</div>
                            <div className="news-slim">6h ago · 121,043 readers</div>
                            <div className="news-bold">◦ FTC digs deeper into Twitter</div>
                            <div className="news-slim">4h ago · 78,080 readers</div>
                            <div className="news-bold">◦ Payrolls jumped recently: ADP</div>
                            <div className="news-slim">6h ago · 31,045 readers</div>
                            <div className="news-bold">◦ New vaccine proves effective against Delta</div>
                            <div className="news-slim">6h ago · 21,542 readers</div>
                            <div className="news-bold">◦ Apple unveils latest iPhone model</div>
                            <div className="news-slim">6h ago · 19,031 readers</div>
                            <div className="news-bold">◦ New study links coffee to longer lifespan</div>
                            <div className="news-slim">6h ago · 17,983 readers</div>
                            <div className="news-bold">◦ NASA to launch new Mars rover mission</div>
                            <div className="news-slim">6h ago · 5,728 readers</div>
                            <div className="news-bold">◦ World Leaders Meet to Discuss Climate Crisis</div>
                            <div className="news-slim">6h ago · 2,333 readers</div>
                            <div className="news-bold">◦ SpaceX Launches Mission to Mars</div>
                            <div className="news-slim">6h ago · 1,003 readers</div>
                            <div className="news-bold">◦ China's Economy Continues to Grow</div>
                            <div className="news-slim">6h ago · 566 readers</div>

                        </div>
                        <button
                            className="show-less-news"
                            onClick={e => setShowLess(!showLess)}
                        >{showLess ? (
                            <span>Show More {arrowDownSVG}</span>
                        ) : (
                            <span>Show Less {arrowDownSVG}</span>
                        )}</button>
                    </div>
                    <div>
                        <ul className="about-section">

                            <li><span><a className="about-a" href="https://about.linkedin.com/">About</a></span></li>
                            <li><span><a className="about-a" href="https://www.linkedin.com/accessibility">Accessibility</a></span></li>
                            <li><span> <a className="about-a" href="https://www.linkedin.com//help/linkedin?trk=footer_d_flagship3_feed">Help Center</a></span></li>
                            <li><span> <a className="about-a" href="https://www.linkedin.com/legal/privacy-policy">Privacy & Terms</a></span></li>
                            <li><span><a className="about-a" href="https://www.linkedin.com/help/linkedin/answer/a1342443">Ad Choices</a></span></li>
                            <li><span> <a className="about-a" href="https://business.linkedin.com/marketing-solutions/ads?trk=n_nav_ads_rr_b&src=li-nav&veh=ad%2Fstart">Advertising</a></span></li>
                            <li><span> <a className="about-a" href="https://business.linkedin.com/talent-solutions?trk=flagship_nav&veh=li-header-dropdown-lts-control&src=li-nav">Business Services</a></span></li>
                            <li><span><a className="about-a" href="https://apps.apple.com/us/app/id288429040">Get the Linkedin app</a></span></li>
                            {/* <li><span><a>More</a></span></li> */}

                        </ul>

                        <div className="footer-linkedin-small">

                            {littleLinkedinSVG}

                            <span className="corp">LinkedLing Corporation 2023</span>
                            </div>
                        </div>
                </div>




            </div>
        )
    )


}

export default PostList
