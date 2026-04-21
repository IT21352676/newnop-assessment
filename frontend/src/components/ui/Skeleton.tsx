import { cn } from "@/lib/utils";

function Skeleton({
  className,
  children,
  loading,
}: {
  className?: string;
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
      <div style={{ opacity: loading ? 0 : 1 }}>{children}</div>
    </div>
  );
}

export { Skeleton };
