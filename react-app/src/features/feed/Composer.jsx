import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../api";
import Avatar from "../../components/Avatar";
import Icon from "../../components/Icon";
import { useToast } from "../../components/Toaster";
import PostModal from "./PostModal";

export default function Composer() {
  const user = useCurrentUser();
  const toast = useToast();
  const [open, setOpen] = useState(null); // null | "text" | "media"
  const close = useCallback(() => setOpen(null), []);
  if (!user) return null;

  return (
    <section className="card feed-composer">
      <div className="feed-composer-top">
        <Link to={`/in/${user.id}`}>
          <Avatar user={user} size={48} />
        </Link>
        <button type="button" className="feed-start" onClick={() => setOpen("text")}>
          Start a post
        </button>
      </div>
      <div className="feed-composer-actions">
        <button type="button" className="feed-composer-act" onClick={() => setOpen("media")}>
          <Icon name="image" style={{ color: "#378fe9" }} /> Media
        </button>
        <button type="button" className="feed-composer-act" onClick={() => toast("Events are coming soon")}>
          <Icon name="event" style={{ color: "#c37d16" }} /> Event
        </button>
        <button type="button" className="feed-composer-act" onClick={() => setOpen("text")}>
          <Icon name="article" style={{ color: "#e06847" }} /> Write article
        </button>
      </div>
      {open && <PostModal onClose={close} focusImage={open === "media"} />}
    </section>
  );
}
