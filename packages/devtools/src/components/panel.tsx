import {
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties
} from "react";
import {
  useRouter,
  useLocation,
  MatchContext,
  type Router,
  type Route,
  type Match
} from "waymark";
import { RouteTree } from "./route-tree";
import { Inspector } from "./inspector";
import { styles } from "../styles";
import {
  Route as RouteIcon,
  MapPin,
  Tag,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from "./icons";

// DevtoolsPanel

export interface DevtoolsPanelProps {
  style?: CSSProperties;
  className?: string;
}

export function DevtoolsPanel({ style, className }: DevtoolsPanelProps) {
  const router = useRouter();
  const currentMatch = useContext(MatchContext);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  useEffect(() => setSelectedRoute(null), [currentMatch]);

  return (
    <div className={className} style={{ ...styles.panel, ...style }}>
      <RoutesSection
        router={router}
        currentMatch={currentMatch}
        selectedRoute={selectedRoute}
        onSelectRoute={setSelectedRoute}
      />
      <CurrentLocationSection router={router} currentMatch={currentMatch} />
      <DetailsSection
        currentMatch={currentMatch}
        selectedRoute={selectedRoute}
      />
    </div>
  );
}

// RoutesSection

interface RoutesSectionProps {
  router: Router;
  currentMatch: Match | null;
  selectedRoute: Route | null;
  onSelectRoute: (route: Route) => void;
}

function RoutesSection({
  router,
  currentMatch,
  selectedRoute,
  onSelectRoute
}: RoutesSectionProps) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <RouteIcon size={12} />
        <span>Routes ({router.routes.length})</span>
      </div>
      <div style={styles.sectionContent}>
        <RouteTree
          routes={router.routes}
          currentMatch={currentMatch}
          selectedRoute={selectedRoute}
          onSelectRoute={onSelectRoute}
        />
      </div>
    </div>
  );
}

// CurrentLocationSection

interface CurrentLocationSectionProps {
  router: Router;
  currentMatch: Match | null;
}

function CurrentLocationSection({
  router,
  currentMatch
}: CurrentLocationSectionProps) {
  const location = useLocation();
  const paramsCount = currentMatch
    ? Object.keys(currentMatch.params).length
    : 0;
  const searchCount = Object.keys(location.search).length;
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <MapPin size={12} />
        <span>Current Location</span>
      </div>
      <div style={styles.sectionContent}>
        <div style={styles.infoRow()}>
          <span style={styles.infoLabel}>Path:</span>
          <code style={styles.infoValue()}>{location.path}</code>
          <div style={styles.infoActionGroup}>
            <button
              title="Go back"
              aria-label="Go back"
              style={styles.button}
              onClick={() => router.navigate(-1)}
            >
              <ArrowLeft size={12} />
            </button>
            <button
              title="Go forward"
              aria-label="Go forward"
              style={styles.button}
              onClick={() => router.navigate(1)}
            >
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {router.basePath !== "/" && (
          <div style={styles.infoRow()}>
            <span style={styles.infoLabel}>Base:</span>
            <code style={styles.infoValue()}>{router.basePath}</code>
          </div>
        )}
        <div style={styles.infoRow()}>
          <span style={styles.infoLabel}>Match:</span>
          {currentMatch ? (
            <code style={styles.infoValue("success")}>
              {currentMatch.route._.pattern}
            </code>
          ) : (
            <span style={styles.badge("error")}>No Match</span>
          )}
        </div>

        {paramsCount > 0 && (
          <InfoSection label={`Params (${paramsCount})`}>
            <Inspector value={currentMatch!.params} />
          </InfoSection>
        )}

        {searchCount > 0 && (
          <InfoSection label={`Search Params (${searchCount})`}>
            <Inspector value={location.search} />
          </InfoSection>
        )}

        {location.state !== undefined && (
          <InfoSection label="History State">
            <Inspector value={location.state} />
          </InfoSection>
        )}
      </div>
    </div>
  );
}

// DetailsSection

interface DetailsSectionProps {
  currentMatch: Match | null;
  selectedRoute: Route | null;
}

function DetailsSection({ currentMatch, selectedRoute }: DetailsSectionProps) {
  const route = selectedRoute ?? currentMatch?.route;
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <Tag size={12} />
        <span>
          {route !== currentMatch?.route ? "Selected Route" : "Matched Route"}
        </span>
      </div>
      <div style={styles.sectionContent}>
        {!route ? (
          <div style={styles.emptyState}>No route selected</div>
        ) : (
          <>
            <div style={styles.infoRow()}>
              <span style={styles.infoLabel}>Pattern:</span>
              <code style={styles.infoValue()}>{route._.pattern}</code>
            </div>
            <InfoSection label="Pattern meta" defaultExpanded={false}>
              <Inspector
                value={{ keys: route._.keys, weights: route._.weights }}
              />
            </InfoSection>
            <div style={styles.infoRow()}>
              <span style={styles.infoLabel}>Components:</span>
              <span style={styles.infoValue()}>
                {route._.components.length}
              </span>
            </div>
            <div style={styles.infoRow()}>
              <span style={styles.infoLabel}>Preloads:</span>
              <span style={styles.infoValue()}>{route._.preloads.length}</span>
            </div>

            {route._.handles.length > 0 && (
              <InfoSection label={`Handles (${route._.handles.length})`}>
                {route._.handles.map((handle, i) => (
                  <Inspector
                    key={i}
                    value={handle}
                    style={i > 0 ? { marginTop: 4 } : {}}
                  />
                ))}
              </InfoSection>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// InfoSection

interface InfoSectionProps {
  label: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

function InfoSection({
  label,
  defaultExpanded = true,
  children
}: InfoSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <>
      <button
        style={styles.infoRow(true)}
        onClick={() => setExpanded(!expanded)}
      >
        <span style={styles.infoLabel}>{label}</span>
        <span style={styles.expandButton(true)} aria-hidden>
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </button>
      {expanded && children}
    </>
  );
}
