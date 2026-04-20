const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${className}`}
    >
      {children}
    </div>
  );
};

export default Badge;
