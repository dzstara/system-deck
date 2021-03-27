import { PropsWithChildren } from "react";
import { ServerConnection } from "util/loader";
import { connect as connectObs } from "services/obs";
import { connect as connectSb } from "services/server";
import { SourcesContextProvider } from "domains/Command/contexts/sources";
import { ScenesContextProvider } from "domains/Command/contexts/scenes";

export default function DataWrapper({ children }: PropsWithChildren<{}>) {
  return (
    <ServerConnection connectFn={connectToSockets}>
      <SourcesContextProvider>
        <ScenesContextProvider>{children}</ScenesContextProvider>
      </SourcesContextProvider>
    </ServerConnection>
  );
}

function connectToSockets() {
  return Promise.all([connectObs(), connectSb()]);
}
