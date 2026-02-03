import { useState, type CSSProperties } from "react";
import { styles } from "../styles";
import { ChevronDown, ChevronRight } from "./icons";

type ValueType = ReturnType<typeof getValueType>;

interface InspectorProps {
  label?: string;
  value: unknown;
  style?: CSSProperties;
}

export function Inspector({ label, value, style }: InspectorProps) {
  return (
    <div style={{ ...styles.inspector, ...style }}>
      <InspectorNode name={label} value={value} defaultExpanded depth={0} />
    </div>
  );
}

interface InspectorNodeProps {
  name?: string;
  value: unknown;
  defaultExpanded?: boolean;
  depth: number;
}

function InspectorNode({
  name,
  value,
  defaultExpanded,
  depth
}: InspectorNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || !depth);
  const type = getValueType(value);
  const expandable = type === "object" || type === "array";
  const itemCount = expandable ? Object.keys(value as object).length : 0;
  const empty = expandable && !itemCount;
  const canExpand = expandable && !empty;

  const formatValue = (t: ValueType): string => {
    switch (t) {
      case "string":
        return `"${value}"`;
      case "bigint":
        return `${value}n`;
      case "symbol":
        return (value as symbol).description
          ? `Symbol(${(value as symbol).description})`
          : "Symbol()";
      case "function":
        return "ƒ()";
      case "array":
        return `[${empty ? "" : "..."}]`;
      case "object":
        return `{${empty ? "" : "..."}}`;
      default:
        return String(value);
    }
  };

  const renderValue = () => (
    <span style={styles.inspectorValue(type)}>
      {formatValue(type)}
      {expandable && (
        <span style={styles.inspectorPreviewCount}>{itemCount}</span>
      )}
    </span>
  );

  return (
    <>
      <div style={styles.inspectorRow}>
        <button
          style={styles.expandButton(canExpand)}
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse" : "Expand"}
          tabIndex={canExpand ? 0 : -1}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        {name !== undefined && (
          <>
            <span style={styles.inspectorKey}>{name}</span>
            <span style={styles.inspectorColon}>:</span>
          </>
        )}
        {!expandable || empty || !expanded ? (
          renderValue()
        ) : (
          <>
            <span style={styles.inspectorBracket}>
              {type === "array" ? "[" : "{"}
            </span>
          </>
        )}
      </div>
      {expandable && !empty && expanded && (
        <div style={styles.inspectorNested}>
          {type === "array"
            ? (value as unknown[]).map((item, index) => (
                <InspectorNode
                  key={index}
                  name={String(index)}
                  value={item}
                  depth={depth + 1}
                />
              ))
            : Object.entries(value as object).map(([key, val]) => (
                <InspectorNode
                  key={key}
                  name={key}
                  value={val}
                  depth={depth + 1}
                />
              ))}
          <div style={styles.inspectorBracket}>
            {type === "array" ? "]" : "}"}
          </div>
        </div>
      )}
    </>
  );
}

function getValueType(value: unknown) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
