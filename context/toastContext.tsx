import * as React from "react";

import ToastCustomError from "../components/ToastError";

interface ToastContextData {
  showToast(text: string, type?: "success" | "warning"): void;
}

const ToastContext = React.createContext<ToastContextData>(
  {} as ToastContextData
);

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [textError, setTextError] = React.useState<string>("");
  const [type, setType] = React.useState<"success" | "warning" | undefined>(
    "warning"
  );

  const visibilityTime = 7000;

  const showToast = React.useCallback(
    (text: string, type?: "success" | "warning") => {
      setTextError(text);
      setType(type);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, visibilityTime);
    },
    [visibilityTime]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {isVisible && (
        <ToastCustomError
          text={textError}
          visibilityTime={visibilityTime}
          type={type}
        />
      )}
      {children}
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export { ToastProvider, useToast };
