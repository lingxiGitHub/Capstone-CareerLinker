import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useConnectMutation,
  useCurrentUser,
  useDeletePostMutation,
  useReactMutation,
  useUnreactMutation,
} from "../../api";
import Avatar from "../../components/Avatar";
import Icon from "../../components/Icon";
import Menu from "../../components/Menu";
import { useToast } from "../../components/Toaster";
import { timeAgo } from "../../lib/time";
import { REACTIONS, REACTION_BY_TYPE } from "../../lib/reactions";
import ReactionBadge from "./ReactionBadge";
import Comments from "./Comments";
import PostModal from "./PostModal";
import ReactionsModal from "./ReactionsModal";
import "./PostCard.css";

function PostBody({ content }) {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el && !expanded) setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [content, expanded]);

  return (
    <div className="post-body">
      <p ref={ref} className={`post-text ${expanded ? "" : "post-clamped"}`}>
        {content}
      </p>
      {overflowing && !expanded && (
        <button type="button" className="post-more" onClick={() => setExpanded(true)}>
          …more
        </button>
      )}
    </div>
  );
}

function LikeButton({ post }) {
  const [react] = useReactMutation();
  const [unreact] = useUnreactMutation();
  const [picker, setPicker] = useState(false);
  const showTimer = useRef();
  const hideTimer = useRef();
  const mine = post.my_reaction ? REACTION_BY_TYPE[post.my_reaction] : null;

  useEffect(() => () => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
  }, []);

  const enter = () => {
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => setPicker(true), 500);
  };
  const leave = () => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setPicker(false), 300);
  };

  const choose = (type) => {
    setPicker(false);
    react({ id: post.id, type });
  };

  return (
    <div className="post-like-wrap" onMouseEnter={enter} onMouseLeave={leave}>
      {picker && (
        <div className="rx-picker" role="toolbar" aria-label="Reactions">
          {REACTIONS.map((r) => (
            <button key={r.type} type="button" className="rx-pick" aria-label={r.label} onClick={() => choose(r.type)}>
              <span className="rx-pick-emoji">{r.emoji}</span>
              <span className="rx-pick-label">{r.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className="post-action"
        style={mine ? { color: mine.color } : undefined}
        aria-pressed={Boolean(mine)}
        onClick={() => {
          setPicker(false);
          clearTimeout(showTimer.current);
          if (mine) unreact(post.id);
          else react({ id: post.id, type: "like" });
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setPicker(true);
          }
        }}
      >
        {mine ? <span className="post-action-emoji">{mine.emoji}</span> : <Icon name="like" size={20} />}
        <span>{mine ? mine.label : "Like"}</span>
      </button>
    </div>
  );
}

export default function PostCard({ post }) {
  const me = useCurrentUser();
  const navigate = useNavigate();
  const toast = useToast();
  const [deletePost] = useDeletePostMutation();
  const [connect, { isLoading: connecting }] = useConnectMutation();
  const [editing, setEditing] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [focusSignal, setFocusSignal] = useState(0);
  const [imgOk, setImgOk] = useState(true);
  const [requested, setRequested] = useState(false);
  const closeEdit = useCallback(() => setEditing(false), []);
  const closeReactions = useCallback(() => setShowReactions(false), []);

  const { author } = post;
  const isMine = me?.id === author.id;
  const profile = `/in/${author.id}`;

  const reactionText = () => {
    if (post.reaction_count > 1 && post.recent_reactors?.[0]) {
      const others = post.reaction_count - 1;
      return `${post.recent_reactors[0]} and ${others} other${others > 1 ? "s" : ""}`;
    }
    return post.reaction_count;
  };

  const openComments = () => {
    setShowComments(true);
    setFocusSignal((n) => n + 1);
  };

  return (
    <article className="card post">
      <header className="post-head">
        <Link to={profile} className="post-avatar" aria-hidden="true" tabIndex={-1}>
          <Avatar user={author} size={48} />
        </Link>
        <div className="post-meta grow">
          <Link to={profile} className="post-author">
            <span className="post-name">
              {author.first_name} {author.last_name}
            </span>
            {author.is_connected && <span className="post-degree"> • 1st</span>}
          </Link>
          {author.headline && <p className="post-headline">{author.headline}</p>}
          <p className="post-time">
            {timeAgo(post.created_at)}
            {post.edited && " • Edited"} • <Icon name="globe" size={14} title="Visible to anyone" />
          </p>
        </div>
        {isMine ? (
          <Menu
            label="Open control menu for post"
            items={[
              { icon: "edit", label: "Edit post", onClick: () => setEditing(true) },
              {
                icon: "trash",
                label: "Delete post",
                danger: true,
                onClick: async () => {
                  if (!window.confirm("Delete post? Are you sure you want to permanently remove this post from CareerLinker?")) return;
                  const res = await deletePost(post.id);
                  toast(res.error ? res.error.message : "Post deleted.", res.error ? "error" : "success");
                },
              },
            ]}
          />
        ) : (
          !author.is_connected &&
          !requested && (
            <button
              type="button"
              className="post-connect"
              disabled={connecting}
              onClick={async () => {
                const res = await connect({ userId: author.id });
                if (res.error) toast(res.error.message, "error");
                else {
                  setRequested(true);
                  toast(`Invitation sent to ${author.first_name}`);
                }
              }}
            >
              <Icon name="add" size={20} /> Connect
            </button>
          )
        )}
      </header>

      <PostBody content={post.content} />

      {post.image_url && imgOk && (
        <img className="post-image" src={post.image_url} alt="" loading="lazy" onError={() => setImgOk(false)} />
      )}

      {(post.reaction_count > 0 || post.comment_count > 0) && (
        <div className="post-counts">
          {post.reaction_count > 0 ? (
            <button type="button" className="post-count-btn" onClick={() => setShowReactions(true)}>
              <span className="rx-stack">
                {post.top_reactions.map((t) => (
                  <ReactionBadge key={t} type={t} />
                ))}
              </span>
              <span>{reactionText()}</span>
            </button>
          ) : (
            <span />
          )}
          {post.comment_count > 0 && (
            <button type="button" className="post-count-btn" onClick={() => setShowComments((s) => !s)}>
              {post.comment_count} comment{post.comment_count > 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}

      <div className="post-actions">
        <LikeButton post={post} />
        <button type="button" className="post-action" onClick={openComments}>
          <Icon name="comment" size={20} />
          <span>Comment</span>
        </button>
        <button type="button" className="post-action" onClick={() => toast("Reposting is coming soon")}>
          <Icon name="repost" size={20} />
          <span>Repost</span>
        </button>
        <button type="button" className="post-action" onClick={() => navigate(isMine ? "/messaging" : `/messaging?to=${author.id}`)}>
          <Icon name="send" size={20} />
          <span>Send</span>
        </button>
      </div>

      {showComments && <Comments post={post} focusSignal={focusSignal} />}

      {editing && <PostModal post={post} onClose={closeEdit} />}
      {showReactions && <ReactionsModal postId={post.id} onClose={closeReactions} />}
    </article>
  );
}
