import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: "Column",
    },
  });

  return (
    <div ref={setNodeRef} className="flex-1">
      {children}
    </div>
  );
};
export default DroppableColumn;
