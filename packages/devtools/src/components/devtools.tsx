import { useState, useLayoutEffect, type CSSProperties } from "react";
import { DevtoolsPanel } from "./panel";
import { FloatingWindow, type FloatingWindowProps } from "./floating-window";
import { useLocalStorage } from "../hooks";
import { Logo } from "./icons";
import { styles } from "../styles";

export interface DevtoolsProps {
  defaultOpen?: boolean;
  buttonPosition?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  buttonStyle?: CSSProperties;
  buttonClassName?: string;
  defaultPosition?: FloatingWindowProps["defaultPosition"];
  defaultSize?: FloatingWindowProps["defaultSize"];
  minSize?: FloatingWindowProps["minSize"];
  maxSize?: FloatingWindowProps["maxSize"];
}

export function Devtools({
  defaultOpen = false,
  buttonPosition = "bottom-left",
  buttonStyle,
  buttonClassName,
  defaultPosition,
  defaultSize,
  minSize,
  maxSize
}: DevtoolsProps) {
  const [open, setOpen] = useLocalStorage("open", defaultOpen);
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleButtonStyle: CSSProperties = {
    ...styles.toggleButton(open, buttonPosition),
    ...buttonStyle
  };

  return (
    <>
      <button
        style={toggleButtonStyle}
        className={buttonClassName}
        onClick={() => setOpen(true)}
        aria-label="Open Waymark devtools"
      >
        <Logo size={18} />
        <span>Waymark</span>
      </button>
      <FloatingWindow
        open={open}
        onClose={() => setOpen(false)}
        title="Waymark Devtools"
        defaultPosition={defaultPosition}
        defaultSize={defaultSize}
        minSize={minSize}
        maxSize={maxSize}
      >
        <DevtoolsPanel />
      </FloatingWindow>
    </>
  );
}
