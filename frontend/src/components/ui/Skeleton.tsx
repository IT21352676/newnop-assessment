import { cn } from "@/lib/utils";

function Skeleton({
  className,
  className2,
  children,
  loading,
}: {
  className?: string;
  className2?: string;
  children?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div
      className={cn(
        loading ? "animate-pulse rounded-md bg-muted" : "",
        className,
      )}
    >
      <div style={{ opacity: loading ? 0 : 1 }} className={className2}>
        {children}
      </div>
    </div>
  );
}

export { Skeleton };
