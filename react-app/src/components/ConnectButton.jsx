import { useNavigate } from "react-router-dom";
import { useConnectMutation, useWithdrawInvitationMutation } from "../api";
import Button from "./Button";
import { useToast } from "./Toaster";

/**
 * The relationship-aware primary action for a person:
 * Connect → Pending (click to withdraw) → Accept → Message.
 */
export default function ConnectButton({ user, status, size = "md", fullWidth = false, messageWhenConnected = true }) {
  const [connect, { isLoading: connecting }] = useConnectMutation();
  const [withdraw, { isLoading: withdrawing }] = useWithdrawInvitationMutation();
  const toast = useToast();
  const navigate = useNavigate();
  const style = fullWidth ? { width: "100%" } : undefined;
  const name = user.first_name;

  if (status === "self") return null;

  if (status === "connected") {
    if (!messageWhenConnected) return null;
    return (
      <Button variant="secondary" size={size} style={style} onClick={() => navigate(`/messaging?to=${user.id}`)}>
        Message
      </Button>
    );
  }

  if (status === "pending_sent") {
    return (
      <Button
        variant="muted"
        size={size}
        icon="clock"
        style={style}
        disabled={withdrawing}
        title="Withdraw invitation"
        onClick={async () => {
          if (!window.confirm(`Withdraw invitation to ${name}?`)) return;
          const res = await withdraw(user.id);
          if (!res.error) toast("Invitation withdrawn");
        }}
      >
        Pending
      </Button>
    );
  }

  const accepting = status === "pending_received";
  return (
    <Button
      variant={accepting ? "primary" : "secondary"}
      size={size}
      icon={accepting ? "check" : "personAdd"}
      style={style}
      disabled={connecting}
      onClick={async () => {
        const res = await connect({ userId: user.id });
        if (res.error) toast(res.error.message, "error");
        else toast(accepting ? `You're now connected with ${name}` : `Invitation sent to ${name}`);
      }}
    >
      {accepting ? "Accept" : "Connect"}
    </Button>
  );
}
