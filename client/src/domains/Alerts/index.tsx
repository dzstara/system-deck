import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ServerConnection } from "util/loader";
import { connect, server } from "services/server";
import Alert from "components/Alert";

export default function AlertsWrapper() {
  return (
    <ServerConnection connectFn={connect}>
      <Alerts />
    </ServerConnection>
  );
}

function Alerts() {
  useEffect(() => {
    server.addEventListener("message", messageHandler);

    return () => {
      server.removeEventListener("message", messageHandler);
    };
  }, []);

  return (
    <ToastContainer
      position="top-right"
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
    />
  );
}

const handledIds: Array<string> = [];

function messageHandler(message: MessageEvent) {
  const payload: Payload = JSON.parse(message.data);

  if (shouldIgnorePayload(payload)) return;

  payload.data.forEach(processEvent);
}

function processEvent(event: Event) {
  if (shouldIgnoreEvent(event)) return;

  const alertEvent = event as AlertEvent;
  handledIds.push(alertEvent.event_id);
  alertEvent.message.forEach((data) =>
    handleAlert({ type: alertEvent.type, ...data })
  );
}

function shouldIgnorePayload(payload: Payload) {
  return payload.type !== "StreamLabsEvent" || !Array.isArray(payload.data);
}

function shouldIgnoreEvent(event: Event) {
  return (
    !event.event_id ||
    event.for !== "twitch_account" ||
    !["follow", "raid"].includes(event.type) ||
    handledIds.includes(event.event_id)
  );
}

function handleAlert(alert: AlertType) {
  if (alert.type === "follow") {
    toast(<FollowAlert name={alert.name} />, {
      autoClose: 10000,
    });
  }

  if (alert.type === "raid") {
    toast(<RaidAlert name={alert.name} amount={alert.raiders} />, {
      autoClose: 30000,
    });
  }
}

function FollowAlert({ name }: { name: string }) {
  return (
    <Alert
      icon="recommend"
      content={({ Highlight }) => (
        <>
          Merci <Highlight>{name}</Highlight> pour le follow&nbsp;!
        </>
      )}
    />
  );
}

function RaidAlert({ name, amount }: { name: string; amount: number }) {
  return (
    <Alert
      icon="celebration"
      content={({ Highlight }) => (
        <>
          Incroyable&nbsp;! <Highlight>{name}</Highlight> raid le stream avec{" "}
          <Highlight>{amount}</Highlight> viewers, merci&nbsp;!
        </>
      )}
    />
  );
}

interface Payload {
  type: "StreamLabsEvent" | string;
  data: Array<Event>;
}

interface Event {
  event_id?: string;
  for: string;
  type: string;
}

interface AlertEvent extends Event {
  event_id: string;
  for: "twitch_account";
  type: "follow" | "raid";
  message: Array<any>;
}

type AlertType =
  | {
      type: "follow";
      name: string;
    }
  | {
      type: "raid";
      name: string;
      raiders: number;
    };
