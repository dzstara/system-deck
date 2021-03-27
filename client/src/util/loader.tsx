import { PropsWithChildren, useEffect, useState } from "react";

interface ObsLoaderState {
  error: Error | null;
  loading: boolean;
}

export function ServerConnection({
  children,
  connectFn,
}: PropsWithChildren<{ connectFn: () => Promise<unknown> }>) {
  const [state, setState] = useState<ObsLoaderState>({
    error: null,
    loading: true,
  });

  useEffect(() => {
    setState({
      loading: true,
      error: null,
    });

    console.log(`Connecting to service...`);

    connectFn()
      .then(() => {
        setState({
          loading: false,
          error: null,
        });
        console.log("Connected to service.");
      })
      .catch((error) => {
        setState({
          loading: false,
          error,
        });
        console.error("Error trying to connect to service!");
        console.error(error);
      });
  }, [connectFn]);

  if (state.loading) {
    return <div>Connecting to service...</div>;
  }

  if (state.error) {
    return (
      <div>
        <p>Could not connect to service!</p>

        <pre>{JSON.stringify(state.error, null, "  ")}</pre>
      </div>
    );
  }

  return <>{children}</>;
}
