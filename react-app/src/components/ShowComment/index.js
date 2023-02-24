import "./ShowComment.css"
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import EditComment from "../EditComment";
import DeleteCommentComponent from "../DeleteComment";


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
                                        <OpenModalButton
                                            buttonText="Edit"
                                            // className="left-bottons"
                                            modalComponent={<EditComment post={post} comment={comment}/>}
                                        />
                                        <OpenModalButton
                                            buttonText="Delete"
                                            // className="left-bottons"
                                            modalComponent={<DeleteCommentComponent post={post} comment={comment} />}
                                        />
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