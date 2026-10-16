import { useEffect, useRef, useState } from "react";
import { useCreatePostMutation, useCurrentUser, useEditPostMutation } from "../../api";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Modal from "../../components/Modal";
import { useToast } from "../../components/Toaster";

const MAX = 3000;

/** Create a post, or edit `post` when given. */
export default function PostModal({ post, onClose, focusImage = false }) {
  const user = useCurrentUser();
  const toast = useToast();
  const [content, setContent] = useState(post?.content ?? "");
  const [imageUrl, setImageUrl] = useState(post?.image_url ?? "");
  const [showImage, setShowImage] = useState(focusImage || Boolean(post?.image_url));
  const [imgOk, setImgOk] = useState(true);
  const [error, setError] = useState(null);
  const [createPost, createState] = useCreatePostMutation();
  const [editPost, editState] = useEditPostMutation();
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const busy = createState.isLoading || editState.isLoading;

  useEffect(() => {
    const t = setTimeout(() => (focusImage ? imgRef.current : textRef.current)?.focus(), 0);
    return () => clearTimeout(t);
  }, [focusImage]);

  useEffect(() => setImgOk(true), [imageUrl]);

  const trimmed = content.trim();
  const over = content.length > MAX;

  const submit = async () => {
    if (!trimmed || over || busy) return;
    setError(null);
    const body = { content: trimmed, image_url: imageUrl.trim() || null };
    const res = post ? await editPost({ id: post.id, ...body }) : await createPost(body);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    toast(post ? "Post updated." : "Post successful.");
    onClose();
  };

  return (
    <Modal
      title={post ? "Edit post" : "Create a post"}
      onClose={onClose}
      width={744}
      footer={
        <>
          <button
            type="button"
            className="post-modal-tool"
            aria-label="Add an image"
            title="Add an image"
            onClick={() => {
              setShowImage(true);
              setTimeout(() => imgRef.current?.focus(), 0);
            }}
          >
            <Icon name="image" />
          </button>
          <span className="grow" />
          {content.length > MAX - 300 && (
            <span className={`small ${over ? "post-over" : "muted"}`}>
              {content.length}/{MAX}
            </span>
          )}
          <Button variant="primary" size="sm" disabled={!trimmed || over || busy} onClick={submit}>
            {post ? "Save" : "Post"}
          </Button>
        </>
      }
    >
      <div className="post-modal-author">
        <Avatar user={user} size={56} />
        <div>
          <div className="bold" style={{ fontSize: 18 }}>
            {user?.first_name} {user?.last_name}
          </div>
          <div className="small muted row" style={{ gap: 4 }}>
            Post to Anyone <Icon name="globe" size={14} />
          </div>
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <textarea
        ref={textRef}
        className="post-modal-text"
        placeholder="What do you want to talk about?"
        aria-label="Post content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
      />
      {showImage && (
        <div className="post-modal-image">
          <label className="small muted" htmlFor="post-image-url">
            Image URL
          </label>
          <input
            id="post-image-url"
            ref={imgRef}
            className="input"
            type="url"
            placeholder="https://…"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {imageUrl.trim() && imgOk && (
            <div className="post-modal-preview">
              <img src={imageUrl.trim()} alt="Preview" onError={() => setImgOk(false)} />
              <button type="button" className="post-modal-remove" aria-label="Remove image" onClick={() => setImageUrl("")}>
                <Icon name="close" size={20} />
              </button>
            </div>
          )}
          {imageUrl.trim() && !imgOk && <p className="field-error">We couldn't load that image.</p>}
        </div>
      )}
    </Modal>
  );
}
