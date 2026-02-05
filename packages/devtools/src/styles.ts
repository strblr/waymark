import type { CSSProperties } from "react";
import type { DevtoolsProps, FloatingWindowProps } from "./components";

const theme = {
  radius: 8,
  font: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16
  },
  fontSize: {
    xs: 10,
    sm: 12
  },
  colors: {
    background: "#1e1e2e",
    backgroundLight: "#2a2a3e",
    backgroundHover: "#3a3a4e",
    border: "#3a3a4e",
    text: "#cdd6f4",
    textDim: "#9399b2",
    textMuted: "#6c7086",
    accent: "#89b4fa",
    accentHover: "#74c7ec",
    success: "#a6e3a1",
    warning: "hsl(49, 99%, 63%)",
    error: "#f38ba8",
    purple: "#cba6f7"
  }
};

export const styles = {
  toggleButton: (
    open: boolean,
    position: NonNullable<DevtoolsProps["buttonPosition"]>
  ) => {
    const positions = {
      "bottom-left": { bottom: 0, left: 0 },
      "bottom-right": { bottom: 0, right: 0 },
      "top-left": { top: 0, left: 0 },
      "top-right": { top: 0, right: 0 }
    };
    return {
      position: "fixed",
      zIndex: 99999,
      background: theme.colors.background,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius,
      padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
      cursor: "pointer",
      display: open ? "none" : "flex",
      alignItems: "center",
      gap: theme.spacing.md,
      margin: theme.spacing.xl,
      color: theme.colors.text,
      fontFamily: theme.font,
      fontSize: theme.fontSize.sm,
      fontWeight: 500,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      ...positions[position]
    };
  },

  floatingWindow: (
    position: NonNullable<FloatingWindowProps["defaultPosition"]>,
    size: NonNullable<FloatingWindowProps["defaultSize"]>
  ) => ({
    position: "fixed",
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    zIndex: 99999,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }),

  floatingWindowResizeHandle: (
    edge: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"
  ) => {
    const positions = {
      n: {
        top: 0,
        left: theme.spacing.md,
        right: theme.spacing.md,
        height: 6,
        cursor: "ns-resize"
      },
      s: {
        bottom: 0,
        left: theme.spacing.md,
        right: theme.spacing.md,
        height: 6,
        cursor: "ns-resize"
      },
      e: {
        right: 0,
        top: theme.spacing.md,
        bottom: theme.spacing.md,
        width: 6,
        cursor: "ew-resize"
      },
      w: {
        left: 0,
        top: theme.spacing.md,
        bottom: theme.spacing.md,
        width: 6,
        cursor: "ew-resize"
      },
      ne: {
        top: 0,
        right: 0,
        width: theme.spacing.lg,
        height: theme.spacing.lg,
        cursor: "nesw-resize"
      },
      nw: {
        top: 0,
        left: 0,
        width: theme.spacing.lg,
        height: theme.spacing.lg,
        cursor: "nwse-resize"
      },
      se: {
        bottom: 0,
        right: 0,
        width: theme.spacing.lg,
        height: theme.spacing.lg,
        cursor: "nwse-resize"
      },
      sw: {
        bottom: 0,
        left: 0,
        width: theme.spacing.lg,
        height: theme.spacing.lg,
        cursor: "nesw-resize"
      }
    };
    return {
      position: "absolute",
      zIndex: 1,
      touchAction: "none",
      ...positions[edge]
    };
  },

  floatingWindowHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: `${theme.colors.backgroundLight}cc`,
    backdropFilter: "blur(12px)",
    cursor: "move",
    userSelect: "none",
    touchAction: "none",
    flexShrink: 0,
    boxSizing: "border-box"
  },

  floatingWindowTitle: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
    fontWeight: 600,
    color: theme.colors.text,
    fontFamily: theme.font,
    fontSize: theme.fontSize.sm
  },

  floatingWindowContent: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },

  panel: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 1,
    height: "100%",
    width: "100%",
    backgroundColor: theme.colors.border,
    fontFamily: theme.font,
    fontSize: theme.fontSize.sm,
    lineHeight: 1.5,
    color: theme.colors.text,
    boxSizing: "border-box"
  },

  section: {
    backgroundColor: theme.colors.background,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.backgroundLight,
    fontWeight: 600,
    fontSize: theme.fontSize.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: theme.colors.textDim,
    flexShrink: 0,
    boxSizing: "border-box"
  },

  sectionContent: {
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
    overflow: "auto",
    flex: 1,
    scrollbarWidth: "thin",
    scrollbarColor: `${theme.colors.border} ${theme.colors.background}`
  },

  infoRow: (clickable?: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
    width: "100%",
    padding: `${theme.spacing.sm}px 0`,
    fontSize: theme.fontSize.sm,
    lineHeight: 1.5,
    color: theme.colors.textDim,
    ...(clickable && {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "inherit"
    })
  }),

  infoLabel: {
    flexShrink: 0
  },

  infoValue: (variant: "default" | "success" = "default") => ({
    color: variant === "success" ? theme.colors.success : theme.colors.text,
    fontFamily: "inherit"
  }),

  infoActionGroup: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginLeft: "auto"
  },

  emptyState: {
    color: theme.colors.textMuted,
    fontStyle: "italic",
    fontSize: theme.fontSize.sm,
    padding: `${theme.spacing.sm}px 0`
  },

  routeTreeItem: (opts: {
    selected: boolean;
    active: boolean;
    depth: number;
  }) => ({
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px ${
      theme.spacing.sm
    }px ${
      theme.spacing.lg + opts.depth * theme.spacing.xl + theme.spacing.sm
    }px`,
    margin: `0 -${theme.spacing.lg}px`,
    gap: theme.spacing.md,
    cursor: "pointer",
    ...(opts.selected && {
      backgroundColor: `${theme.colors.backgroundHover}50`
    }),
    ...(opts.active && { backgroundColor: theme.colors.backgroundHover })
  }),

  routeIndicator: (status: "active" | "matched" | "inactive") => {
    const colorMap = {
      active: theme.colors.warning,
      matched: theme.colors.warning,
      inactive: theme.colors.textMuted
    };
    return {
      width: theme.spacing.md,
      height: theme.spacing.md,
      borderRadius: "50%",
      backgroundColor: colorMap[status],
      flexShrink: 0
    };
  },

  routeTreePattern: (navigable: boolean) => ({
    fontFamily: "inherit",
    fontSize: theme.fontSize.sm,
    color: navigable ? theme.colors.text : theme.colors.textMuted
  }),

  routeTreeLabel: {
    marginLeft: 6,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontStyle: "italic"
  },

  inspector: {
    fontFamily: "inherit",
    background: theme.colors.backgroundLight,
    borderRadius: theme.radius,
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`
  },

  inspectorRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    padding: `${theme.spacing.xs}px 0`,
    fontSize: theme.fontSize.sm,
    lineHeight: "18px"
  },

  inspectorKey: {
    color: theme.colors.purple,
    flexShrink: 0
  },

  inspectorColon: {
    color: theme.colors.textMuted
  },

  inspectorValue: (
    type:
      | "string"
      | "number"
      | "bigint"
      | "boolean"
      | "null"
      | "undefined"
      | "function"
      | "symbol"
      | "array"
      | "object"
  ) => {
    const colorMap = {
      string: theme.colors.success,
      number: theme.colors.warning,
      bigint: theme.colors.warning,
      boolean: theme.colors.accent,
      null: theme.colors.textMuted,
      undefined: theme.colors.textMuted,
      function: theme.colors.textMuted,
      symbol: theme.colors.textMuted,
      array: theme.colors.text,
      object: theme.colors.text
    };
    return {
      color: colorMap[type],
      wordBreak: "break-all"
    };
  },

  inspectorPreviewCount: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginLeft: theme.spacing.sm
  },

  inspectorNested: {
    paddingLeft: theme.spacing.lg,
    borderLeft: `1px solid ${theme.colors.border}`,
    marginLeft: theme.spacing.md
  },

  inspectorBracket: {
    color: theme.colors.textMuted
  },

  button: {
    background: theme.colors.background,
    border: "none",
    color: theme.colors.textDim,
    cursor: "pointer",
    padding: theme.spacing.sm,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius,
    flexShrink: 0
  },

  expandButton: (visible: boolean): CSSProperties => ({
    ...styles.button,
    background: "none",
    padding: 0,
    width: theme.spacing.xl,
    height: 18,
    visibility: visible ? "visible" : "hidden"
  }),

  badge: (variant: "success" | "warning" | "error" | "info") => {
    const colorMap = {
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      info: theme.colors.accent
    };
    return {
      display: "inline-flex",
      alignItems: "center",
      padding: `${theme.spacing.xs}px 6px`,
      borderRadius: theme.radius,
      fontSize: theme.fontSize.xs,
      fontWeight: 600,
      textTransform: "uppercase",
      backgroundColor: `${colorMap[variant]}22`,
      color: colorMap[variant]
    };
  }
} satisfies Record<string, CSSProperties | ((...args: any[]) => CSSProperties)>;
