import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  useCurrentUser,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useGetConnectionsQuery,
  useGetConversationQuery,
  useGetConversationsQuery,
  useGetProfileQuery,
  useLazyFindConversationWithQuery,
  useSendMessageMutation,
  useStartConversationMutation,
  useTypeaheadQuery,
} from "../../api";
import Avatar from "../../components/Avatar";
import Button, { IconButton } from "../../components/Button";
import Icon from "../../components/Icon";
import Menu from "../../components/Menu";
import RailFooter from "../../components/RailFooter";
import { useToast } from "../../components/Toaster";
import { messageTime } from "../../lib/time";
import useDocumentTitle from "../../lib/useDocumentTitle";
import "./MessagingPage.css";

const fullName = (u) => (u ? `${u.first_name} ${u.last_name}` : "");
const GROUP_MS = 5 * 60 * 1000;

function useIsNarrow(px = 760) {
  const query = `(max-width: ${px}px)`;
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return narrow;
}

function dayLabel(iso) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "TODAY";
  const days = (now - d) / 86400000;
  if (days < 7) return d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const opts = { month: "short", day: "numeric" };
  if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString("en-US", opts).toUpperCase();
}

/** Group messages into day sections, then into runs by the same sender within 5 minutes. */
function groupMessages(messages) {
  const days = [];
  for (const m of messages) {
    const label = dayLabel(m.created_at);
    let day = days[days.length - 1];
    if (!day || day.label !== label) {
      day = { label, groups: [] };
      days.push(day);
    }
    const group = day.groups[day.groups.length - 1];
    const last = group?.messages[group.messages.length - 1];
    if (group && group.sender.id === m.sender.id && new Date(m.created_at) - new Date(last.created_at) < GROUP_MS) {
      group.messages.push(m);
    } else {
      day.groups.push({ sender: m.sender, start: m.created_at, messages: [m] });
    }
  }
  return days;
}

// ---------------------------------------------------------------- list

function ConversationList({ conversations, isLoading, me, selectedId, onCompose }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("focused");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (conversations ?? []).filter((c) => {
      if (filter === "unread" && !c.unread) return false;
      if (!q) return true;
      return c.participants.some((p) => fullName(p).toLowerCase().includes(q));
    });
  }, [conversations, query, filter]);

  return (
    <section className="msg-list" aria-label="Conversations">
      <header className="msg-list-head">
        <h1 className="msg-title">Messaging</h1>
        <IconButton icon="compose" label="Compose a new message" size={20} onClick={onCompose} />
      </header>
      <div className="msg-search">
        <Icon name="search" size={16} className="msg-search-icon" />
        <input type="search" placeholder="Search messages" aria-label="Search messages" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="msg-pills" role="tablist" aria-label="Filter conversations">
        {[
          ["focused", "Focused"],
          ["unread", "Unread"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            className={`msg-pill ${filter === key ? "active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="msg-rows">
        {isLoading &&
          [0, 1, 2, 3].map((i) => (
            <li key={i} className="msg-row msg-row-skeleton">
              <span className="skeleton" style={{ width: 56, height: 56, borderRadius: "50%" }} />
              <span className="grow stack" style={{ gap: 8 }}>
                <span className="skeleton" style={{ width: "50%", height: 12 }} />
                <span className="skeleton" style={{ width: "85%", height: 10 }} />
              </span>
            </li>
          ))}
        {!isLoading && visible.length === 0 && (
          <li className="msg-list-empty muted">{query || filter === "unread" ? "No matching conversations." : "No conversations yet."}</li>
        )}
        {visible.map((c) => {
          const other = c.participants[0];
          const last = c.last_message;
          const fromMe = last?.sender.id === me.id;
          return (
            <li key={c.id}>
              <Link
                to={`/messaging/${c.id}`}
                className={`msg-row ${c.id === selectedId ? "selected" : ""} ${c.unread ? "unread" : ""}`}
                aria-current={c.id === selectedId ? "page" : undefined}
              >
                <Avatar user={other} size={56} />
                <span className="grow msg-row-body">
                  <span className="msg-row-top">
                    <span className="msg-row-name truncate">{c.participants.map(fullName).join(", ")}</span>
                    {last && <span className="msg-row-time">{messageTime(last.created_at)}</span>}
                  </span>
                  <span className="msg-row-preview">
                    <span className="truncate">
                      {last ? `${fromMe ? "You" : last.sender.first_name}: ${last.content}` : "No messages yet"}
                    </span>
                    {c.unread && <span className="msg-unread-dot" aria-label="Unread" />}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------- composer

function Composer({ onSend, disabled, autoFocus, placeholder = "Write a message…" }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const submit = async () => {
    const content = text.trim();
    if (!content || disabled) return;
    const ok = await onSend(content);
    if (ok !== false) setText("");
  };

  return (
    <form
      className="msg-composer"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <textarea
        ref={ref}
        rows={1}
        className="msg-composer-input"
        placeholder={placeholder}
        aria-label="Write a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <div className="msg-composer-bar">
        <div className="row" style={{ gap: 0 }}>
          <IconButton icon="image" label="Attach an image" size={20} />
          <IconButton icon="article" label="Attach a file" size={20} />
          <IconButton icon="emoji" label="Open emoji keyboard" size={20} />
        </div>
        <Button type="submit" variant="primary" size="sm" disabled={!text.trim() || disabled}>
          Send
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------- thread

function MessageBubble({ message, mine }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [editMessage, { isLoading: saving }] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const toast = useToast();

  const save = async () => {
    const content = draft.trim();
    if (!content) return;
    if (content === message.content) return setEditing(false);
    const res = await editMessage({ id: message.id, content });
    if (res.error) toast(res.error.message, "error");
    else setEditing(false);
  };

  if (editing) {
    return (
      <div className="msg-edit">
        <textarea
          className="input"
          value={draft}
          aria-label="Edit message"
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setEditing(false);
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              save();
            }
          }}
        />
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
          <Button variant="tertiary" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" disabled={saving || !draft.trim()} onClick={save}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="msg-bubble">
      <p className="msg-text">
        {message.content}
        {message.edited && <span className="msg-edited"> (edited)</span>}
      </p>
      {mine && (
        <div className="msg-bubble-menu">
          <Menu
            label="Message options"
            items={[
              {
                icon: "edit",
                label: "Edit",
                onClick: () => {
                  setDraft(message.content);
                  setEditing(true);
                },
              },
              {
                icon: "trash",
                label: "Delete",
                danger: true,
                onClick: async () => {
                  if (!window.confirm("Delete this message? This can't be undone.")) return;
                  const res = await deleteMessage(message.id);
                  if (res.error) toast(res.error.message, "error");
                  else toast("Message deleted");
                },
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

function ThreadHeader({ person, onBack, showBack }) {
  return (
    <header className="msg-thread-head">
      {showBack && <IconButton icon="back" label="Back to conversations" onClick={onBack} />}
      {person ? (
        <div className="grow" style={{ minWidth: 0 }}>
          <Link to={`/in/${person.id}`} className="msg-thread-name hover-underline">
            {fullName(person)}
          </Link>
          {person.headline && <div className="small muted truncate">{person.headline}</div>}
        </div>
      ) : (
        <div className="grow msg-thread-name">New message</div>
      )}
    </header>
  );
}

function ProfileIntro({ person }) {
  return (
    <div className="msg-intro">
      <Link to={`/in/${person.id}`}>
        <Avatar user={person} size={72} />
      </Link>
      <Link to={`/in/${person.id}`} className="msg-intro-name hover-underline">
        {fullName(person)}
      </Link>
      {person.headline && <p className="small muted">{person.headline}</p>}
    </div>
  );
}

function Thread({ conversationId, me, showBack, onBack }) {
  const { data, isLoading, isError } = useGetConversationQuery(conversationId, { pollingInterval: 3000 });
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const toast = useToast();
  const scrollRef = useRef(null);
  const stickRef = useRef(true);
  const lastCount = useRef(0);

  const messages = data?.messages ?? [];
  const person = data?.participants?.[0];
  const days = useMemo(() => groupMessages(messages), [messages]);

  // Reset stickiness when switching threads.
  useEffect(() => {
    stickRef.current = true;
    lastCount.current = 0;
  }, [conversationId]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (messages.length !== lastCount.current && stickRef.current) {
      el.scrollTop = el.scrollHeight;
    }
    lastCount.current = messages.length;
  }, [messages.length]);

  const onScroll = () => {
    const el = scrollRef.current;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const send = async (content) => {
    stickRef.current = true;
    const res = await sendMessage({ conversationId, content });
    if (res.error) {
      toast(res.error.message, "error");
      return false;
    }
    return true;
  };

  if (isError) {
    return (
      <section className="msg-thread">
        <ThreadHeader showBack={showBack} onBack={onBack} />
        <div className="msg-empty">
          <p className="muted">This conversation couldn't be found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="msg-thread" aria-label={person ? `Conversation with ${fullName(person)}` : "Conversation"}>
      <ThreadHeader person={person} showBack={showBack} onBack={onBack} />
      <div className="msg-scroll" ref={scrollRef} onScroll={onScroll}>
        {isLoading ? (
          <div className="msg-intro">
            <span className="skeleton" style={{ width: 72, height: 72, borderRadius: "50%" }} />
            <span className="skeleton" style={{ width: 160, height: 14 }} />
            <span className="skeleton" style={{ width: 220, height: 10 }} />
          </div>
        ) : (
          <>
            {person && <ProfileIntro person={person} />}
            {days.map((day) => (
              <div key={day.label + day.groups[0].start}>
                <div className="msg-day" role="separator">
                  <span>{day.label}</span>
                </div>
                {day.groups.map((g) => (
                  <div key={g.messages[0].id} className="msg-group">
                    <Link to={`/in/${g.sender.id}`} className="msg-group-avatar">
                      <Avatar user={g.sender} size={32} />
                    </Link>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <div className="msg-group-head">
                        <Link to={`/in/${g.sender.id}`} className="bold hover-underline">
                          {fullName(g.sender)}
                        </Link>
                        <span className="small subtle">{new Date(g.start).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
                      </div>
                      {g.messages.map((m) => (
                        <MessageBubble key={m.id} message={m} mine={m.sender.id === me.id} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
      <Composer key={conversationId} onSend={send} disabled={sending || isLoading} autoFocus />
    </section>
  );
}

// ---------------------------------------------------------------- new message

function PersonPicker({ onPick }) {
  const [q, setQ] = useState("");
  const term = q.trim();
  const { data: search, isFetching } = useTypeaheadQuery(term, { skip: !term });
  const { data: conns } = useGetConnectionsQuery();
  const people = term ? search?.people ?? [] : conns?.connections ?? [];

  return (
    <div className="msg-picker">
      <div className="msg-picker-input">
        <label htmlFor="msg-to" className="muted">
          To:
        </label>
        <input id="msg-to" autoFocus placeholder="Type a name" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      </div>
      <div className="msg-picker-label small muted">{term ? (isFetching ? "Searching…" : "People") : "Your connections"}</div>
      <ul className="msg-picker-list">
        {people.map((p) => (
          <li key={p.id}>
            <button type="button" className="msg-picker-row" onClick={() => onPick(p)}>
              <Avatar user={p} size={40} />
              <span className="grow" style={{ minWidth: 0 }}>
                <span className="bold block">{fullName(p)}</span>
                {p.headline && <span className="small muted truncate block">{p.headline}</span>}
              </span>
            </button>
          </li>
        ))}
        {term && !isFetching && people.length === 0 && <li className="msg-list-empty muted">No people found for “{term}”.</li>}
      </ul>
    </div>
  );
}

function NewMessage({ initialUserId, me, showBack, onBack }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [picked, setPicked] = useState(null);
  const [findConversation] = useLazyFindConversationWithQuery();
  const [startConversation, { isLoading: sending }] = useStartConversationMutation();
  const { data: profile } = useGetProfileQuery(initialUserId, { skip: !initialUserId || !!picked });
  const person = picked ?? (initialUserId && profile ? profile : null);

  const pick = async (p) => {
    if (p.id === me.id) return toast("You can't message yourself", "error");
    const { data } = await findConversation(p.id);
    if (data?.id) navigate(`/messaging/${data.id}`);
    else setPicked(p);
  };

  const send = async (content) => {
    const res = await startConversation({ userId: person.id, content });
    if (res.error) {
      toast(res.error.message, "error");
      return false;
    }
    navigate(`/messaging/${res.data.id}`, { replace: true });
    return true;
  };

  return (
    <section className="msg-thread" aria-label="New message">
      <header className="msg-thread-head">
        {showBack && <IconButton icon="back" label="Back to conversations" onClick={onBack} />}
        <div className="grow msg-thread-name">New message</div>
      </header>
      {person ? (
        <>
          <div className="msg-to-chip-row">
            <span className="muted">To:</span>
            <span className="msg-to-chip">
              {fullName(person)}
              <button
                type="button"
                aria-label={`Remove ${fullName(person)}`}
                onClick={() => {
                  setPicked(null);
                  if (initialUserId) navigate("/messaging?new=1", { replace: true });
                }}
              >
                <Icon name="close" size={16} />
              </button>
            </span>
          </div>
          <div className="msg-scroll">
            <ProfileIntro person={person} />
          </div>
          <Composer onSend={send} disabled={sending} autoFocus />
        </>
      ) : initialUserId ? (
        <div className="msg-scroll">
          <div className="msg-intro">
            <span className="skeleton" style={{ width: 72, height: 72, borderRadius: "50%" }} />
            <span className="skeleton" style={{ width: 160, height: 14 }} />
          </div>
        </div>
      ) : (
        <PersonPicker onPick={pick} />
      )}
    </section>
  );
}

// ---------------------------------------------------------------- page

function EmptyInbox({ onCompose }) {
  return (
    <div className="msg-empty">
      <svg width="200" height="140" viewBox="0 0 200 140" aria-hidden="true">
        <rect x="20" y="20" width="120" height="80" rx="12" fill="#d0e8ff" />
        <path d="M44 100 l-6 24 28-24z" fill="#d0e8ff" />
        <rect x="40" y="44" width="80" height="8" rx="4" fill="#0a66c2" opacity=".35" />
        <rect x="40" y="62" width="56" height="8" rx="4" fill="#0a66c2" opacity=".35" />
        <rect x="90" y="56" width="90" height="60" rx="12" fill="#e9e5df" />
        <path d="M160 116 l8 18-24-18z" fill="#e9e5df" />
        <circle cx="116" cy="86" r="5" fill="#c9c4bc" />
        <circle cx="134" cy="86" r="5" fill="#c9c4bc" />
        <circle cx="152" cy="86" r="5" fill="#c9c4bc" />
      </svg>
      <h2 className="msg-empty-title">No messages yet</h2>
      <p className="muted">Reach out and start a conversation to advance your career.</p>
      <Button variant="secondary" onClick={onCompose}>
        Start a conversation
      </Button>
    </div>
  );
}

function PromoRail({ me }) {
  return (
    <aside className="msg-rail">
      <div className="card msg-promo">
        <p className="small muted">Ad · ···</p>
        <p className="msg-promo-text">Get the latest jobs and industry news</p>
        <div className="msg-promo-avatars">
          <span className="msg-promo-logo">CL</span>
        </div>
        <p className="bold">{me?.first_name}, explore relevant opportunities with CareerLinker Premium</p>
        <Button variant="secondary" size="sm" style={{ marginTop: 12 }}>
          Try for free
        </Button>
      </div>
      <RailFooter />
    </aside>
  );
}

export default function MessagingPage() {
  useDocumentTitle("Messaging");
  const me = useCurrentUser();
  const navigate = useNavigate();
  const narrow = useIsNarrow();
  const { conversationId: idParam } = useParams();
  const [params] = useSearchParams();
  const toParam = params.get("to");
  const toUserId = toParam ? Number(toParam) : null;
  const composing = params.has("new") || !!toUserId;
  const conversationId = idParam ? Number(idParam) : null;

  const { data, isLoading } = useGetConversationsQuery(undefined, { pollingInterval: 5000 });
  const conversations = data?.conversations;
  const [findConversation] = useLazyFindConversationWithQuery();
  const [checkedTo, setCheckedTo] = useState(null);

  // /messaging?to=<id>: jump to an existing thread with that person if there is one.
  useEffect(() => {
    if (!toUserId) return;
    let cancelled = false;
    setCheckedTo(null);
    findConversation(toUserId).then(({ data: found }) => {
      if (cancelled) return;
      if (found?.id) navigate(`/messaging/${found.id}`, { replace: true });
      else setCheckedTo(toUserId);
    });
    return () => {
      cancelled = true;
    };
  }, [toUserId, findConversation, navigate]);

  // Desktop: with nothing selected, open the most recent conversation.
  useEffect(() => {
    if (!narrow && !conversationId && !composing && conversations?.length) {
      navigate(`/messaging/${conversations[0].id}`, { replace: true });
    }
  }, [narrow, conversationId, composing, conversations, navigate]);

  const compose = () => navigate("/messaging?new=1");
  const back = () => navigate("/messaging");
  const showingDetail = !!conversationId || composing;

  let detail;
  if (toUserId) {
    detail =
      checkedTo === toUserId ? (
        <NewMessage key={`to-${toUserId}`} initialUserId={toUserId} me={me} showBack={narrow} onBack={back} />
      ) : (
        <section className="msg-thread">
          <div className="msg-empty">
            <span className="skeleton" style={{ width: 72, height: 72, borderRadius: "50%" }} />
          </div>
        </section>
      );
  } else if (composing) {
    detail = <NewMessage key="new" me={me} showBack={narrow} onBack={back} />;
  } else if (conversationId) {
    detail = <Thread conversationId={conversationId} me={me} showBack={narrow} onBack={back} />;
  } else if (!isLoading && !conversations?.length) {
    detail = (
      <section className="msg-thread">
        <EmptyInbox onCompose={compose} />
      </section>
    );
  } else {
    detail = <section className="msg-thread" />;
  }

  return (
    <main className="page msg-page">
      <div className={`card msg-shell ${showingDetail ? "show-detail" : "show-list"}`}>
        <ConversationList conversations={conversations} isLoading={isLoading} me={me} selectedId={conversationId} onCompose={compose} />
        {detail}
      </div>
      <PromoRail me={me} />
    </main>
  );
}
