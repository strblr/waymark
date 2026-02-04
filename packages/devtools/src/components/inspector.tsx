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
      <InspectorNode name={label} value={value} defaultExpanded />
    </div>
  );
}

interface InspectorNodeProps {
  name?: string;
  value: unknown;
  defaultExpanded?: boolean;
}

function InspectorNode({ name, value, defaultExpanded }: InspectorNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const type = getValueType(value);
  const objectLike = type === "object" || type === "array";
  const itemCount = objectLike ? Object.keys(value as object).length : 0;
  const empty = objectLike && !itemCount;
  const expandable = objectLike && !empty;

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
      {objectLike && (
        <span style={styles.inspectorPreviewCount}>{itemCount}</span>
      )}
    </span>
  );

  return (
    <>
      <div style={styles.inspectorRow}>
        <button
          tabIndex={expandable ? 0 : -1}
          aria-label={expanded ? "Collapse" : "Expand"}
          onClick={() => setExpanded(!expanded)}
          style={styles.expandButton(expandable)}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        {name !== undefined && (
          <>
            <span style={styles.inspectorKey}>{name}</span>
            <span style={styles.inspectorColon}>:</span>
          </>
        )}
        {!objectLike || empty || !expanded ? (
          renderValue()
        ) : (
          <>
            <span style={styles.inspectorBracket}>
              {type === "array" ? "[" : "{"}
            </span>
          </>
        )}
      </div>
      {objectLike && !empty && expanded && (
        <div style={styles.inspectorNested}>
          {type === "array"
            ? (value as unknown[]).map((item, index) => (
                <InspectorNode key={index} name={String(index)} value={item} />
              ))
            : Object.entries(value as object).map(([key, val]) => (
                <InspectorNode key={key} name={key} value={val} />
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
