import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAddCommentMutation, useCurrentUser, useDeleteCommentMutation, useEditCommentMutation } from "../../api";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Menu from "../../components/Menu";
import { useToast } from "../../components/Toaster";
import { timeAgo } from "../../lib/time";

function autoGrow(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function Comment({ comment, post, me, onReply }) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [liked, setLiked] = useState(false);
  const [editComment, { isLoading: saving }] = useEditCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const editRef = useRef(null);
  const a = comment.author;
  const mine = me?.id === a.id;
  const canDelete = mine || me?.id === post.author.id;

  useEffect(() => {
    if (editing) {
      autoGrow(editRef.current);
      editRef.current?.focus();
    }
  }, [editing]);

  const save = async () => {
    if (!draft.trim()) return;
    const res = await editComment({ id: comment.id, content: draft.trim() });
    if (res.error) toast(res.error.message, "error");
    else setEditing(false);
  };

  const items = [];
  if (mine) items.push({ icon: "edit", label: "Edit", onClick: () => { setDraft(comment.content); setEditing(true); } });
  if (canDelete)
    items.push({
      icon: "trash",
      label: "Delete",
      danger: true,
      onClick: async () => {
        if (!window.confirm("Delete this comment?")) return;
        const res = await deleteComment(comment.id);
        toast(res.error ? res.error.message : "Comment deleted.", res.error ? "error" : "success");
      },
    });

  return (
    <li className="cmt">
      <Link to={`/in/${a.id}`} aria-hidden="true" tabIndex={-1}>
        <Avatar user={a} size={32} />
      </Link>
      <div className="grow">
        <div className="cmt-bubble">
          <div className="cmt-top">
            <Link to={`/in/${a.id}`} className="cmt-who grow">
              <span className="cmt-name">
                {a.first_name} {a.last_name}
                {a.id === post.author.id && <span className="cmt-author-tag">Author</span>}
              </span>
              {a.headline && <span className="cmt-headline truncate">{a.headline}</span>}
            </Link>
            <span className="cmt-time">
              {timeAgo(comment.created_at)}
              {comment.edited && " (edited)"}
            </span>
            {items.length > 0 && <Menu label="Comment options" items={items} />}
          </div>
          {editing ? (
            <div className="cmt-edit">
              <textarea
                ref={editRef}
                className="cmt-input"
                value={draft}
                aria-label="Edit comment"
                onChange={(e) => {
                  setDraft(e.target.value);
                  autoGrow(e.target);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setEditing(false);
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    save();
                  }
                }}
              />
              <div className="row" style={{ marginTop: 8 }}>
                <Button variant="primary" size="sm" disabled={!draft.trim() || saving} onClick={save}>
                  Save Changes
                </Button>
                <Button variant="muted" size="sm" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="cmt-text">{comment.content}</p>
          )}
        </div>
        <div className="cmt-actions">
          <button type="button" className={liked ? "cmt-liked" : ""} onClick={() => setLiked((l) => !l)}>
            Like
          </button>
          <span aria-hidden="true">|</span>
          <button type="button" onClick={() => onReply(a)}>
            Reply
          </button>
        </div>
      </div>
    </li>
  );
}

export default function Comments({ post, focusSignal }) {
  const me = useCurrentUser();
  const toast = useToast();
  const [text, setText] = useState("");
  const [shown, setShown] = useState(2);
  const [addComment, { isLoading }] = useAddCommentMutation();
  const inputRef = useRef(null);

  useEffect(() => {
    if (focusSignal) inputRef.current?.focus();
  }, [focusSignal]);

  const submit = async () => {
    const content = text.trim();
    if (!content || isLoading) return;
    const res = await addComment({ postId: post.id, content });
    if (res.error) toast(res.error.message, "error");
    else {
      setText("");
      setShown((s) => s + 1);
      if (inputRef.current) inputRef.current.style.height = "auto";
    }
  };

  const reply = (user) => {
    setText((t) => (t ? t : `@${user.first_name} ${user.last_name} `));
    inputRef.current?.focus();
  };

  const comments = post.comments;
  const visible = comments.slice(Math.max(0, comments.length - shown));
  const hidden = comments.length - visible.length;

  return (
    <section className="cmt-section" aria-label="Comments">
      <div className="cmt-compose">
        <Avatar user={me} size={40} />
        <div className="cmt-field grow">
          <textarea
            ref={inputRef}
            rows={1}
            className="cmt-input"
            placeholder="Add a comment…"
            aria-label="Add a comment"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              autoGrow(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
        </div>
      </div>
      {text.trim() && (
        <div className="cmt-post-row">
          <Button variant="primary" size="sm" disabled={isLoading} onClick={submit}>
            Comment
          </Button>
        </div>
      )}

      {hidden > 0 && (
        <button type="button" className="cmt-load" onClick={() => setShown((s) => s + 5)}>
          Load more comments ({hidden})
        </button>
      )}
      <ul className="cmt-list">
        {visible.map((c) => (
          <Comment key={c.id} comment={c} post={post} me={me} onReply={reply} />
        ))}
      </ul>
    </section>
  );
}
