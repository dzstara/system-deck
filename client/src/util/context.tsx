import { createContext, PropsWithChildren, useContext } from "react";

export function generateContext<T>(defaultValue: T, useData: () => T) {
  const context = createContext<T>(defaultValue);

  function ContextProvider({ children }: PropsWithChildren<{}>) {
    const value = useData();

    return <context.Provider children={children} value={value} />;
  }

  function useThisContext() {
    return useContext(context);
  }

  return { ContextProvider, useThisContext };
}
