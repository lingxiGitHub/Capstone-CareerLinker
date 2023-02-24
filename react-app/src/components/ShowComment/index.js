import "./ShowComment.css"
import { useDispatch, useSelector } from "react-redux";

function ShowComment({ post, postComments }) {

    // console.log(post)
    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser.id)

    let sessionLinks;


    return (
        <>
            <ul>
                {
                    postComments.map(comment => {
                        // console.log(comment.comment_user_id)

                        return (
                            <>
                                <li key={comment.comment_id}>{comment.comment_content}</li>

                                {comment.comment_user_id ==sessionUser.id  && (
                                    <>
                                        <button>Edit Comment</button>
                                        <button>Delete Comment</button>
                                    </>
                                )}

                            </>
                        )

                    })
                }
            </ul>


        </>
    )
}

export default ShowComment