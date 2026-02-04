import type { ReactNode } from "react";
import { useLocalStorage } from "../hooks";
import { styles } from "../styles";
import { Logo, X } from "./icons";

export interface FloatingWindowProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  children?: ReactNode;
}

export function FloatingWindow({
  open,
  onClose,
  title,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 900, height: 556 },
  minSize = { width: 600, height: 300 },
  maxSize = { width: 1600, height: 900 },
  children
}: FloatingWindowProps) {
  const [position, setPosition] = useLocalStorage("position", defaultPosition);
  const [size, setSize] = useLocalStorage("size", defaultSize);
  const resizeEdges = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;

  const clampPosition = (pos: { x: number; y: number }) => ({
    x: Math.max(0, Math.min(pos.x, window.innerWidth - 100)),
    y: Math.max(0, Math.min(pos.y, window.innerHeight - 50))
  });

  const clampSize = (size: { width: number; height: number }) => ({
    width: Math.max(minSize.width, Math.min(size.width, maxSize.width)),
    height: Math.max(minSize.height, Math.min(size.height, maxSize.height))
  });

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    let frame: number;
    const { clientX, clientY } = e;

    const handleDrag = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setPosition(
          clampPosition({
            x: position.x + e.clientX - clientX,
            y: position.y + e.clientY - clientY
          })
        );
      });
    };

    const handleDragEnd = () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleResizeStart =
    (edge: (typeof resizeEdges)[number]) => (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      let frame: number;
      const { clientX, clientY } = e;

      const handleResize = (e: MouseEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const deltaX = e.clientX - clientX;
          const deltaY = e.clientY - clientY;
          let width = size.width;
          let height = size.height;

          if (edge.includes("e")) {
            width += deltaX;
          } else if (edge.includes("w")) {
            width -= deltaX;
          }
          if (edge.includes("s")) {
            height += deltaY;
          } else if (edge.includes("n")) {
            height -= deltaY;
          }

          const clampedSize = clampSize({ width, height });
          let x = position.x;
          let y = position.y;

          if (edge.includes("w")) {
            x += size.width - clampedSize.width;
          }
          if (edge.includes("n")) {
            y += size.height - clampedSize.height;
          }

          setSize(clampedSize);
          setPosition(clampPosition({ x, y }));
        });
      };

      const handleResizeEnd = () => {
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", handleResizeEnd);
      };

      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
    };

  return !open ? null : (
    <div style={styles.floatingWindow(position, size)}>
      {resizeEdges.map(edge => (
        <div
          key={edge}
          style={styles.floatingWindowResizeHandle(edge)}
          onMouseDown={handleResizeStart(edge)}
        />
      ))}
      <div style={styles.floatingWindowHeader} onMouseDown={handleDragStart}>
        <div style={styles.floatingWindowTitle}>
          <Logo size={18} />
          <span>{title}</span>
        </div>
        <button
          onClick={onClose}
          style={styles.button}
          aria-label="Close devtools"
        >
          <X size={16} />
        </button>
      </div>
      <div style={styles.floatingWindowContent}>{children}</div>
    </div>
  );
}
