import { useEffect, useRef, useState } from "react";
import { useGetFeedQuery } from "../../api";
import useDocumentTitle from "../../lib/useDocumentTitle";
import LeftRail from "./LeftRail";
import RightRail from "./RightRail";
import Composer from "./Composer";
import PostCard from "./PostCard";
import Icon from "../../components/Icon";
import "./Feed.css";

const PAGE = 10;

export function PostSkeleton() {
  return (
    <div className="card feed-skeleton" aria-hidden="true">
      <div className="row">
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
        <div className="grow">
          <div className="skeleton" style={{ width: "40%", height: 12, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: "65%", height: 10 }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 10, marginTop: 20 }} />
      <div className="skeleton" style={{ height: 10, marginTop: 8, width: "90%" }} />
      <div className="skeleton" style={{ height: 10, marginTop: 8, width: "60%" }} />
      <div className="skeleton" style={{ height: 200, marginTop: 16 }} />
    </div>
  );
}

export default function FeedPage() {
  useDocumentTitle("Feed");
  const [limit, setLimit] = useState(PAGE);
  const { data, isLoading, isFetching, isError, refetch } = useGetFeedQuery({ limit });
  const sentinel = useRef(null);
  const hasMore = data?.has_more;

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) setLimit((l) => l + PAGE);
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, isFetching]);

  const posts = data?.posts ?? [];

  return (
    <div className="feed-layout page">
      <aside className="feed-left">
        <LeftRail />
      </aside>

      <main className="feed-main" aria-label="Main feed">
        <Composer />
        <div className="feed-sort">
          <hr />
          <span>
            Sort by: <strong>Top</strong>
            <Icon name="caretDown" size={16} />
          </span>
        </div>

        {isLoading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {isError && !data && (
          <div className="card card-pad feed-empty">
            <p>We couldn't load your feed.</p>
            <button type="button" className="link" onClick={refetch}>
              Try again
            </button>
          </div>
        )}

        {!isLoading && data && posts.length === 0 && (
          <div className="card card-pad feed-empty">
            <h2 className="card-title">Your feed is empty</h2>
            <p className="muted">Start a post or connect with people to see updates here.</p>
          </div>
        )}

        <ul className="feed-list">
          {posts.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>

        <div ref={sentinel} />
        {hasMore && isFetching && <PostSkeleton />}
        {data && !hasMore && posts.length > 0 && (
          <p className="feed-end muted small">You're all caught up</p>
        )}
      </main>

      <aside className="feed-right">
        <RightRail />
      </aside>
    </div>
  );
}
