import React, { useState } from "react";

export interface TriageResult {
  classification: {
    type: string;
    component: string;
  };
  prioritySeverity: {
    currentPriority: string;
    suggestedPriority: string;
    currentSeverity: string;
    suggestedSeverity: string;
    rationale: string;
  };
  isUnclear: boolean;
  missingInfo: string[];
  rootCauses: { area: string; cause: string }[];
  suggestedFixes: string[];
  debuggingSteps: { step: number; action: string }[];
  jiraComment: string;
}

type ColorKey = "red" | "amber" | "blue" | "teal" | "coral" | "green" | "gray";

const COLOR_MAP: Record<ColorKey, { bg: string; text: string }> = {
  red: { bg: "#3A1F1F", text: "#FF6B6B" },
  amber: { bg: "#3A2F1A", text: "#F4B740" },
  blue: { bg: "#1E2F45", text: "#5AA9FF" },
  teal: { bg: "#1B3A34", text: "#3DD6B5" },
  coral: { bg: "#3A2621", text: "#FF8A65" },
  green: { bg: "#233A1F", text: "#7ED957" },
  gray: { bg: "#2A2A2A", text: "#CFCFCF" },
};
function getPriorityColor(val: string): ColorKey {
  const v = val?.toLowerCase() ?? "";
  if (v.includes("urgent") || v.includes("critical")) return "red";
  if (v.includes("high")) return "amber";
  if (v.includes("medium")) return "blue";
  return "gray";
}

function getSeverityColor(val: string): ColorKey {
  const v = val?.toLowerCase() ?? "";
  if (v.includes("critical") || v.includes("blocker")) return "red";
  if (v.includes("major")) return "coral";
  if (v.includes("minor")) return "teal";
  return "gray";
}

const Badge = ({ label, colorKey }: { label: string; colorKey: ColorKey }) => {
  const { bg, text } = COLOR_MAP[colorKey];
  return (
    <span
      className={`font-bold border border-${bg}/10 rounded-md`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 12,
        padding: "3px 10px",
        background: bg,
        color: text,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-primary/40 tracking-wide font-bold"
    style={{
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: 8,
    }}
  >
    {children}
  </p>
);

const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className="bg-primary/10 p-3 border border-primary/10 rounded-xl">
    {children}
  </div>
);

const RowItem = ({
  left,
  children,
}: {
  left: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div
    className="text-primary/50 bg-black/40 mb-2 p-4 rounded-xl mt-2"
    style={{
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      fontSize: 14,
    }}
  >
    {left}
    <span>{children}</span>
  </div>
);

const StepNum = ({ n }: { n: number }) => (
  <span
    className="bg-accent/20 text-accent"
    style={{
      minWidth: 20,
      height: 20,
      borderRadius: "50%",
      fontSize: 11,
      fontWeight: 500,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      marginTop: 2,
    }}
  >
    {n}
  </span>
);

const AreaTag = ({ label }: { label: string }) => (
  <span
    className="bg-primary/10 text-primary"
    style={{
      fontSize: 11,
      fontWeight: 500,
      padding: "2px 8px",
      borderRadius: 6,
      flexShrink: 0,
      marginTop: 2,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

interface TriageReportProps {
  data: TriageResult;
}

export default function TriageReport({ data }: TriageReportProps) {
  const [copied, setCopied] = useState(false);

  const pc = getPriorityColor(data.prioritySeverity.currentPriority);
  const ps = getPriorityColor(data.prioritySeverity.suggestedPriority);
  const sc = getSeverityColor(data.prioritySeverity.currentSeverity);
  const ss = getSeverityColor(data.prioritySeverity.suggestedSeverity);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.jiraComment).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const arrowStyle: React.CSSProperties = {
    fontSize: 14,
    color: "#B4B2A9",
    margin: "0 4px",
  };

  const sectionStyle: React.CSSProperties = { marginBottom: "0.5rem" };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 720,
        padding: "1rem 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <span className="text-primary/60 text-[17px] font-bold uppercase text-center">
          Issue triage report
        </span>
        {data.classification.type && (
          <Badge label={data.classification.type} colorKey="blue" />
        )}
        {data.classification.component && (
          <Badge label={data.classification.component} colorKey="gray" />
        )}
      </div>

      {/* Unclear banner */}
      {data.isUnclear && (
        <div
          className="bg-yellow-500/20 border border-yellow-500/20 rounded-xl p-4 items-center text-yellow-500 mb-4"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div className="flex gap-2 justify-center items-center w-full">
            <p
              className="mt-0.5 text-[12px] sm:text-sm text-center"
              style={{
                fontWeight: 500,
              }}
            >
              ⚠ Issue lacks sufficient detail — root cause analysis skipped
            </p>
          </div>
          {data.missingInfo.length > 0 && (
            <ul
              style={{ listStyle: "none" }}
              className="justify-items-start mt-4"
            >
              {data.missingInfo.map((m, i) => (
                <li
                  className="text-yellow-500 "
                  key={i}
                  style={{ fontSize: 13, padding: "2px 0" }}
                >
                  — {m}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Priority & Severity */}
      <div style={sectionStyle}>
        <SectionLabel>Priority &amp; severity</SectionLabel>
        <div className="flex flex-col sm:flex-row gap-2">
          <Card>
            <span className="text-primary/50 text-[13px] font-bold">
              Priority
            </span>
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="mt-2 justify-center"
            >
              <Badge
                label={data.prioritySeverity.currentPriority}
                colorKey={pc}
              />
              <span style={arrowStyle}>→</span>
              <Badge
                label={data.prioritySeverity.suggestedPriority}
                colorKey={ps}
              />
            </div>
          </Card>
          <Card>
            <span className="text-primary/50 text-[13px] font-bold">
              Severity
            </span>
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="mt-2 justify-center"
            >
              <Badge
                label={data.prioritySeverity.currentSeverity}
                colorKey={sc}
              />
              <span style={arrowStyle}>→</span>
              <Badge
                label={data.prioritySeverity.suggestedSeverity}
                colorKey={ss}
              />
            </div>
          </Card>
        </div>
        {data.prioritySeverity.rationale && (
          <p
            className="mb-4 mt-4 text-primary/50"
            style={{
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {data.prioritySeverity.rationale}
          </p>
        )}
      </div>

      {/* Root causes */}
      {!data.isUnclear && data.rootCauses.length > 0 && (
        <div style={sectionStyle}>
          <SectionLabel>Root cause possibilities</SectionLabel>
          <Card style={{ padding: "0.5rem 1.25rem" }}>
            {data.rootCauses.map((r, i) => (
              <RowItem key={i} left={<AreaTag label={r.area} />}>
                {r.cause}
              </RowItem>
            ))}
          </Card>
        </div>
      )}

      {/* Suggested fixes */}
      {!data.isUnclear && data.suggestedFixes.length > 0 && (
        <div style={sectionStyle}>
          <SectionLabel>Suggested fixes</SectionLabel>
          <Card style={{ padding: "0.5rem 1.25rem" }}>
            {data.suggestedFixes.map((f, i) => (
              <RowItem key={i} left={<StepNum n={i + 1} />}>
                {f}
              </RowItem>
            ))}
          </Card>
        </div>
      )}

      {/* Debugging steps */}
      {!data.isUnclear && data.debuggingSteps.length > 0 && (
        <div style={sectionStyle}>
          <SectionLabel>Debugging steps</SectionLabel>
          <Card style={{ padding: "0.5rem 1.25rem" }}>
            {data.debuggingSteps.map((s) => (
              <RowItem key={s.step} left={<StepNum n={s.step} />}>
                {s.action}
              </RowItem>
            ))}
          </Card>
        </div>
      )}

      {/* Jira comment */}
      {data.jiraComment && (
        <div style={sectionStyle}>
          <SectionLabel>Jira comment</SectionLabel>
          <pre
            className="bg-accent/20 border border-accent/20 rounded-xl p-4 items-center text-accent"
            style={{
              borderRadius: 8,
              fontSize: 13,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              fontFamily: "system-ui, sans-serif",
              margin: 0,
            }}
          >
            {data.jiraComment}
          </pre>
          <button
            onClick={handleCopy}
            className={`mt-2 p-1.5 text-[12px] bg-accent/20 border border-accent/20 rounded-md items-center text-accent cursor-pointer ${copied ? "bg-green-500/20 border border-green-500/20 rounded-md p-1.5 items-center text-green-500" : ""}`}
            style={{
              transition: "all 0.15s",
            }}
          >
            {copied ? "Copied!" : "Copy comment"}
          </button>
        </div>
      )}
    </div>
  );
}
