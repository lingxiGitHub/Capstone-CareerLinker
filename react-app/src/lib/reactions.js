export const REACTIONS = [
  { type: "like", label: "Like", emoji: "👍", color: "#378fe9" },
  { type: "celebrate", label: "Celebrate", emoji: "👏", color: "#44712e" },
  { type: "support", label: "Support", emoji: "🫶", color: "#715e86" },
  { type: "love", label: "Love", emoji: "❤️", color: "#df704d" },
  { type: "insightful", label: "Insightful", emoji: "💡", color: "#e7a33e" },
  { type: "funny", label: "Funny", emoji: "😂", color: "#4da0b4" },
];

export const REACTION_BY_TYPE = Object.fromEntries(REACTIONS.map((r) => [r.type, r]));
