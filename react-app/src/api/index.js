import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "same-origin",
  prepareHeaders: (headers) => {
    const token = readCookie("csrf_token");
    if (token) headers.set("X-CSRFToken", token);
    return headers;
  },
});

/** Normalize Flask errors into { message, errors } so forms can show them. */
const baseQueryWithErrors = async (args, apiCtx, extra) => {
  const result = await baseQuery(args, apiCtx, extra);
  if (result.error) {
    const data = result.error.data;
    result.error = {
      status: result.error.status,
      message: data?.message || "Something went wrong. Please try again.",
      errors: data?.errors || {},
    };
  }
  return result;
};

// Every query that can contain a given post, so mutations can patch it in place.
const POST_LIST_QUERIES = ["getFeed", "getUserPosts", "search"];

function patchPost(dispatch, getState, post, { remove = false } = {}) {
  const state = getState();
  for (const endpoint of POST_LIST_QUERIES) {
    for (const arg of api.util.selectCachedArgsForQuery(state, endpoint)) {
      dispatch(
        api.util.updateQueryData(endpoint, arg, (draft) => {
          const i = draft.posts.findIndex((p) => p.id === post.id);
          if (i === -1) return;
          if (remove) draft.posts.splice(i, 1);
          else draft.posts[i] = post;
        })
      );
    }
  }
}

const patchOnSuccess = async (_arg, { dispatch, getState, queryFulfilled }) => {
  try {
    const { data } = await queryFulfilled;
    patchPost(dispatch, getState, data);
  } catch {
    /* error surfaced by the caller */
  }
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrors,
  tagTypes: ["Session", "Feed", "Profile", "Network", "Suggestions", "Conversations", "Conversation", "Jobs", "Notifications", "Badges"],
  endpoints: (b) => ({
    // ---- session
    getSession: b.query({ query: () => "/auth/", providesTags: ["Session"] }),
    login: b.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    demoLogin: b.mutation({ query: () => ({ url: "/auth/demo", method: "POST" }) }),
    signup: b.mutation({ query: (body) => ({ url: "/auth/signup", method: "POST", body }) }),
    logout: b.mutation({ query: () => ({ url: "/auth/logout", method: "POST" }) }),

    // ---- feed & posts
    getFeed: b.query({
      query: ({ limit = 10 } = {}) => `/posts?limit=${limit}`,
      providesTags: ["Feed"],
    }),
    getPost: b.query({ query: (id) => `/posts/${id}`, providesTags: (r, e, id) => [{ type: "Feed", id }] }),
    createPost: b.mutation({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      invalidatesTags: ["Feed", "Profile"],
    }),
    editPost: b.mutation({
      query: ({ id, ...body }) => ({ url: `/posts/${id}`, method: "PUT", body }),
      onQueryStarted: patchOnSuccess,
    }),
    deletePost: b.mutation({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled;
          patchPost(dispatch, getState, { id }, { remove: true });
          dispatch(api.util.invalidateTags(["Profile"]));
        } catch {
          /* noop */
        }
      },
    }),
    react: b.mutation({
      query: ({ id, type }) => ({ url: `/posts/${id}/reaction`, method: "PUT", body: { type } }),
      onQueryStarted: patchOnSuccess,
    }),
    unreact: b.mutation({
      query: (id) => ({ url: `/posts/${id}/reaction`, method: "DELETE" }),
      onQueryStarted: patchOnSuccess,
    }),
    getReactions: b.query({ query: (id) => `/posts/${id}/reactions`, keepUnusedDataFor: 0 }),
    addComment: b.mutation({
      query: ({ postId, content }) => ({ url: `/posts/${postId}/comments`, method: "POST", body: { content } }),
      onQueryStarted: patchOnSuccess,
    }),
    editComment: b.mutation({
      query: ({ id, content }) => ({ url: `/posts/comments/${id}`, method: "PUT", body: { content } }),
      onQueryStarted: patchOnSuccess,
    }),
    deleteComment: b.mutation({
      query: (id) => ({ url: `/posts/comments/${id}`, method: "DELETE" }),
      onQueryStarted: patchOnSuccess,
    }),

    // ---- profiles
    getProfile: b.query({ query: (id) => `/users/${id}`, providesTags: (r, e, id) => [{ type: "Profile", id }, "Profile"] }),
    getUserPosts: b.query({
      query: ({ id, limit = 5 }) => `/users/${id}/posts?limit=${limit}`,
      providesTags: ["Profile"],
    }),
    updateMe: b.mutation({
      query: (body) => ({ url: "/users/me", method: "PUT", body }),
      invalidatesTags: ["Session", "Profile", "Feed"],
    }),
    addExperience: b.mutation({
      query: (body) => ({ url: "/users/me/experiences", method: "POST", body }),
      invalidatesTags: ["Profile"],
    }),
    deleteExperience: b.mutation({
      query: (id) => ({ url: `/users/me/experiences/${id}`, method: "DELETE" }),
      invalidatesTags: ["Profile"],
    }),
    addEducation: b.mutation({
      query: (body) => ({ url: "/users/me/educations", method: "POST", body }),
      invalidatesTags: ["Profile"],
    }),
    deleteEducation: b.mutation({
      query: (id) => ({ url: `/users/me/educations/${id}`, method: "DELETE" }),
      invalidatesTags: ["Profile"],
    }),
    addSkill: b.mutation({
      query: (name) => ({ url: "/users/me/skills", method: "POST", body: { name } }),
      invalidatesTags: ["Profile"],
    }),
    deleteSkill: b.mutation({
      query: (id) => ({ url: `/users/me/skills/${id}`, method: "DELETE" }),
      invalidatesTags: ["Profile"],
    }),
    getSuggestions: b.query({
      query: (limit = 12) => `/users/suggestions?limit=${limit}`,
      providesTags: ["Suggestions"],
    }),
    getBadges: b.query({ query: () => "/users/me/badges", providesTags: ["Badges"] }),

    // ---- network
    getConnections: b.query({ query: () => "/network/connections", providesTags: ["Network"] }),
    getInvitations: b.query({ query: () => "/network/invitations", providesTags: ["Network"] }),
    connect: b.mutation({
      query: ({ userId, message }) => ({ url: "/network/invitations", method: "POST", body: { user_id: userId, message } }),
      invalidatesTags: ["Network", "Profile", "Suggestions", "Badges", "Feed"],
    }),
    acceptInvitation: b.mutation({
      query: (id) => ({ url: `/network/invitations/${id}/accept`, method: "POST" }),
      invalidatesTags: ["Network", "Profile", "Badges", "Feed", "Notifications"],
    }),
    ignoreInvitation: b.mutation({
      query: (id) => ({ url: `/network/invitations/${id}`, method: "DELETE" }),
      invalidatesTags: ["Network", "Profile", "Badges", "Suggestions", "Notifications"],
    }),
    withdrawInvitation: b.mutation({
      query: (userId) => ({ url: `/network/users/${userId}/invitation`, method: "DELETE" }),
      invalidatesTags: ["Network", "Profile", "Suggestions"],
    }),
    removeConnection: b.mutation({
      query: (userId) => ({ url: `/network/connections/${userId}`, method: "DELETE" }),
      invalidatesTags: ["Network", "Profile", "Suggestions", "Feed"],
    }),

    // ---- messaging
    getConversations: b.query({ query: () => "/conversations", providesTags: ["Conversations"] }),
    getConversation: b.query({
      query: (id) => `/conversations/${id}`,
      providesTags: (r, e, id) => [{ type: "Conversation", id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Opening a thread marks it read, so refresh the unread badges.
        try {
          await queryFulfilled;
          dispatch(api.util.invalidateTags(["Badges"]));
        } catch {
          /* noop */
        }
      },
    }),
    findConversationWith: b.query({ query: (userId) => `/conversations/with/${userId}` }),
    startConversation: b.mutation({
      query: ({ userId, content }) => ({ url: "/conversations", method: "POST", body: { user_id: userId, content } }),
      invalidatesTags: ["Conversations"],
    }),
    sendMessage: b.mutation({
      query: ({ conversationId, content }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body: { content },
      }),
      async onQueryStarted({ conversationId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(api.util.upsertQueryData("getConversation", conversationId, data));
          dispatch(api.util.invalidateTags(["Conversations"]));
        } catch {
          /* noop */
        }
      },
    }),
    editMessage: b.mutation({
      query: ({ id, content }) => ({ url: `/messages/${id}`, method: "PUT", body: { content } }),
      async onQueryStarted(_a, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(api.util.upsertQueryData("getConversation", data.id, data));
          dispatch(api.util.invalidateTags(["Conversations"]));
        } catch {
          /* noop */
        }
      },
    }),
    deleteMessage: b.mutation({
      query: (id) => ({ url: `/messages/${id}`, method: "DELETE" }),
      async onQueryStarted(_a, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(api.util.upsertQueryData("getConversation", data.id, data));
          dispatch(api.util.invalidateTags(["Conversations"]));
        } catch {
          /* noop */
        }
      },
    }),

    // ---- jobs
    getJobs: b.query({
      query: (params = {}) => ({ url: "/jobs", params }),
      providesTags: ["Jobs"],
    }),
    getJob: b.query({ query: (id) => `/jobs/${id}`, providesTags: (r, e, id) => [{ type: "Jobs", id }] }),
    saveJob: b.mutation({
      query: ({ id, saved }) => ({ url: `/jobs/${id}/save`, method: saved ? "PUT" : "DELETE" }),
      invalidatesTags: ["Jobs"],
    }),
    applyJob: b.mutation({
      query: ({ id, ...body }) => ({ url: `/jobs/${id}/apply`, method: "POST", body }),
      invalidatesTags: ["Jobs"],
    }),

    // ---- notifications & search
    getNotifications: b.query({ query: () => "/notifications", providesTags: ["Notifications"] }),
    markNotificationsSeen: b.mutation({
      query: () => ({ url: "/notifications/seen", method: "POST" }),
      invalidatesTags: ["Badges"],
    }),
    search: b.query({ query: (q) => `/search?q=${encodeURIComponent(q)}`, providesTags: ["Feed", "Network"] }),
    typeahead: b.query({ query: (q) => `/search/typeahead?q=${encodeURIComponent(q)}` }),
  }),
});

export const {
  useGetSessionQuery,
  useLoginMutation,
  useDemoLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGetFeedQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useEditPostMutation,
  useDeletePostMutation,
  useReactMutation,
  useUnreactMutation,
  useGetReactionsQuery,
  useAddCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useGetProfileQuery,
  useGetUserPostsQuery,
  useUpdateMeMutation,
  useAddExperienceMutation,
  useDeleteExperienceMutation,
  useAddEducationMutation,
  useDeleteEducationMutation,
  useAddSkillMutation,
  useDeleteSkillMutation,
  useGetSuggestionsQuery,
  useGetBadgesQuery,
  useGetConnectionsQuery,
  useGetInvitationsQuery,
  useConnectMutation,
  useAcceptInvitationMutation,
  useIgnoreInvitationMutation,
  useWithdrawInvitationMutation,
  useRemoveConnectionMutation,
  useGetConversationsQuery,
  useGetConversationQuery,
  useLazyFindConversationWithQuery,
  useStartConversationMutation,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useGetJobsQuery,
  useGetJobQuery,
  useSaveJobMutation,
  useApplyJobMutation,
  useGetNotificationsQuery,
  useMarkNotificationsSeenMutation,
  useSearchQuery,
  useTypeaheadQuery,
} = api;

/** The signed-in user (or null). Session is loaded once in <App/>. */
export function useCurrentUser() {
  const { data } = useGetSessionQuery();
  return data?.user ?? null;
}
