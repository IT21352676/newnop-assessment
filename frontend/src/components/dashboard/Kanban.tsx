import {
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  IconDragDrop,
  IconFileTypeCsv,
  IconJson,
  IconUsersGroup,
} from "@tabler/icons-react";
import {
  Bot,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllIssues,
  getAllIssueStatus,
  getAllUsers,
  updateIssue,
} from "../../lib/api";
import { useAuthStore, useIssueStore } from "../../lib/store";
import { Issue, IssueStatus, User } from "../../lib/types";
import { issueStatusMap } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import CreateIssue from "./CreateIssue";
import InspectionIssue from "./InspectionIssue";
import SortableIssueCard from "./SortableIssueCard";
import DroppableColumn from "../ui/DroppableColumn";
import ScrollIndicator from "../ui/ScrollIndicator";
import Modal from "../ui/Modal";
import StatusConfirm from "./UpdateStatus";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AISuggestion from "./AISuggestion";
import { Skeleton } from "../ui/Skeleton";

const Kanban = () => {
  const { issues, setIssues, loading, setLoading } = useIssueStore();
  const { userId } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [issueStatus, setIssueStatus] = useState<IssueStatus[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{
    id: string;
    suggestions: {
      content: string;
      reasoning: string;
      role: string;
    };
  }>();

  const checkScrollAvailability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollAvailability();
    window.addEventListener("resize", checkScrollAvailability);
    return () => window.removeEventListener("resize", checkScrollAvailability);
  }, [filteredIssues, loading, issues]);

  useEffect(() => {
    setLoading(true);
    const fetchIssueStatus = async () => {
      const issueStatus = await getAllIssueStatus();
      setIssueStatus(issueStatus);
    };
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setUsers(users);
    };
    fetchIssueStatus();
    fetchUsers();
    setLoading(false);
  }, []);

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    const filtered = issues.filter((issue) => {
      const matchesUser =
        selectedUserId === null || issue.author?.userId === selectedUserId;
      const matchesSearch =
        !q ||
        issue.title?.toLowerCase().includes(q) ||
        issue.issueId?.toLowerCase().includes(q);

      let matchesDate = true;
      if (dateFrom || dateTo) {
        const issueDate = issue.createdAt
          ? new Date(issue.createdAt).setHours(0, 0, 0, 0)
          : null;
        if (issueDate !== null) {
          if (dateFrom) {
            matchesDate = issueDate >= new Date(dateFrom).setHours(0, 0, 0, 0);
          }
          if (matchesDate && dateTo) {
            matchesDate =
              issueDate <= new Date(dateTo).setHours(23, 59, 59, 999);
          }
        } else {
          matchesDate = false;
        }
      }

      return matchesUser && matchesSearch && matchesDate;
    });
    setFilteredIssues(filtered);
  }, [selectedUserId, searchTerm, dateFrom, dateTo, issues]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  const fetchIssueData = async () => {
    setLoading(true);
    try {
      const issues = await getAllIssues();
      setIssues(issues);
    } catch (err: any) {
      toast.error(
        err.response
          ? err.response.data.message
            ? err.response.data.message
            : err.response
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchIssueData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isCreatingModalOpen]);

  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);
  const [statusUpdatingIssue, setStatusUpdatingIssue] = useState<{
    id: string;
    issue: Issue;
    currentStatus: IssueStatus;
    newStatus: IssueStatus;
  }>();

  const handleUpdateStatus = async (
    id: string,
    status: IssueStatus,
    skipConfirm = false,
  ) => {
    setLoading(true);
    const issue = issues.find((i) => i.issueId === id);
    if (!skipConfirm) {
      setConfirmStatusOpen(true);
      setStatusUpdatingIssue({
        id,
        issue,
        currentStatus: issue?.status,
        newStatus: status,
      });
    } else {
      if (issue) {
        try {
          await updateIssue({ ...issue, status, issueId: id });
          fetchIssueData();
          toast.success(`Issue updated successfully`);
          if (selectedIssue?.issueId === id) setSelectedIssue(null);
        } catch (err: any) {
          toast.error(
            err.response
              ? err.response.data.message
                ? err.response.data.message
                : err.response
              : "Something went wrong",
          );
        }
      }
    }
    setLoading(false);
  };

  const exportData = (formatType: "json" | "csv") => {
    try {
      toast.loading(`Exporting issues as ${formatType}...`);
      if (formatType === "json") {
        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(filteredIssues));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "issues.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      } else {
        const headers = [
          "ID",
          "Title",
          "Status",
          "Priority",
          "Severity",
          "Author",
          "Created At",
        ];
        const csvData = [
          headers,
          ...filteredIssues.map((i) => [
            i.issueId,
            i.title,
            i.status,
            i.priority,
            i.severity,
            i.author.userId,
            new Date(i.createdAt).toUTCString(),
          ]),
        ]
          .map((e) => e.join(","))
          .join("\n");
        const dataStr =
          "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);
        const move = document.createElement("a");
        move.setAttribute("href", dataStr);
        move.setAttribute("download", "issues.csv");
        document.body.appendChild(move);
        move.click();
        move.remove();
      }
      toast.dismiss();
      toast.success(`Issues exported successfully`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(
        err.response
          ? err.response.data.message
            ? err.response.data.message
            : err.response
          : "Something went wrong",
      );
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Issue") {
      setActiveIssue(event.active.data.current.issue);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveIssue(null);
    const { active, over } = event;
    if (!over) return;

    const issueId = active.id as string;
    const activeData = active.data.current;

    let newStatus: IssueStatus;
    if (over.data.current?.type === "Column") {
      newStatus = over.id as IssueStatus;
    } else if (over.data.current?.type === "Issue") {
      newStatus = (over.data.current.issue as Issue).status;
    }

    if (newStatus && activeData?.issue.status !== newStatus) {
      await handleUpdateStatus(issueId, newStatus, false);
    }
  };

  return (
    <div className="flex-1 flex flex-col ">
      <main className="w-full mx-auto py-10 overflow-y-auto">
        <div className="grid space-y-8 mb-4">
          <div className="flex justify-between gap-3 w-full flex-wrap">
            <CreateIssue
              isOpen={isCreatingModalOpen}
              onClose={() => setIsCreatingModalOpen(false)}
            />

            <Skeleton
              loading={loading}
              className="flex w-fit"
              className2="flex h-full"
            >
              <button
                onClick={() => setIsCreatingModalOpen(true)}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
              >
                <Plus className="w-5 h-5" /> Create Issue
              </button>
            </Skeleton>
            <Skeleton loading={loading} className="w-fit">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title or ID…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 h-10 rounded-xl border border-primary/20 bg-card/80 text-sm text-primary placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all w-56"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 text-muted hover:text-primary transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </Skeleton>
            <Skeleton loading={loading} className="w-fit">
              <div className="flex gap-2 flex-wrap">
                <div className="relative flex items-center">
                  <CalendarDays className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type={dateFrom ? "date" : "text"}
                    value={dateFrom}
                    placeholder="Start date"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="pl-9 pr-8 py-2 h-10 rounded-xl border border-primary/20 bg-card/80 text-sm text-primary placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all w-44 [color-scheme:dark]"
                  />
                  {dateFrom && (
                    <button
                      onClick={() => setDateFrom("")}
                      className="absolute right-3 text-muted hover:text-primary transition-colors text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <span className="text-muted text-xs self-center">to</span>

                <div className="relative flex items-center">
                  <CalendarDays className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type={dateTo ? "date" : "text"}
                    value={dateTo}
                    placeholder="End date"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="pl-9 pr-8 py-2 h-10 rounded-xl border border-primary/20 bg-card/80 text-sm text-primary placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all w-44 [color-scheme:dark]"
                  />
                  {dateTo && (
                    <button
                      onClick={() => setDateTo("")}
                      className="absolute right-3 text-muted hover:text-primary transition-colors text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </Skeleton>

            <Popover>
              <Skeleton loading={loading} className="w-fit">
                <PopoverTrigger asChild>
                  <button className="btn-secondary flex items-center gap-2 px-5 py-2.5 text-sm">
                    <Download className="w-4 h-4" /> Export Data
                  </button>
                </PopoverTrigger>{" "}
              </Skeleton>
              <PopoverContent className="w-fit bg-card border-none focus:outline-none">
                <div className="grid gap-4">
                  <button
                    onClick={() => exportData("json")}
                    className="bg-accent/30 flex items-center gap-2 px-5 py-2.5 text-sm rounded-md border border-accent/70 hover:bg-accent/60"
                  >
                    <IconJson className="w-4 h-4" /> Export JSON
                  </button>
                  <button
                    onClick={() => exportData("csv")}
                    className="bg-accent/30 flex items-center gap-2 px-5 py-2.5 text-sm rounded-md border border-accent/70 hover:bg-accent/60"
                  >
                    <IconFileTypeCsv className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Skeleton loading={loading} className="w-full">
            <div className="grid bg-card py-2 px-4 rounded-2xl gap-4">
              <div className="flex gap-2 items-center">
                <IconUsersGroup className="w-6 h-6 mr-2 mt-2 text-primary/50" />{" "}
                <span className="text-sm text-muted text-start justify-start items-start">
                  Filter by author
                </span>
              </div>
              <div className="flex overflow-auto w-full">
                <div className="flex gap-2 items-start custom-scrollbar">
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className={`justify-center items-center text-sm rounded-full border border-primary/20 w-10 h-10 hover:bg-accent/60 ${selectedUserId === null ? "bg-accent/60" : "bg-card/80"}`}
                  >
                    All
                  </button>

                  {[...users]
                    .sort((a, b) =>
                      a.userId === userId ? -1 : b.userId === userId ? 1 : 0,
                    )
                    .map((user, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div className="grid grid-cols-1 justify-center">
                            <button
                              onClick={() => setSelectedUserId(user.userId)}
                              className={`justify-center items-center text-sm rounded-full border border-primary/20 w-10 h-10 hover:bg-accent/60 ${selectedUserId === user.userId ? "bg-accent/60" : "bg-card/80"}`}
                            >
                              {user.userId.charAt(0)}
                            </button>
                            {user.userId === userId && (
                              <span className="font-bold uppercase tracking-wide text-muted text-[10px] mt-1">
                                You
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-accent" side="bottom">
                          <p>{user.userId}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                </div>
              </div>
            </div>
          </Skeleton>
        </div>

        <div className="relative">
          <ScrollIndicator direction="left" visible={canScrollLeft} />
          <ScrollIndicator direction="right" visible={canScrollRight} />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollAvailability}
              className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide"
            >
              {issueStatus.map((status) => {
                const columnIssues = filteredIssues.filter(
                  (i) => i.status === status,
                );
                return (
                  <Skeleton
                    loading={loading}
                    className="min-w-90 min-h-full"
                    className2="flex h-full"
                  >
                    <div
                      key={status}
                      className="flex flex-col gap-4 min-w-90 bg-card/80 p-4 rounded-2xl mb-4"
                    >
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${issueStatusMap[status].color} animate-pulse`}
                          >
                            {issueStatusMap[status].icon}
                          </span>
                          <h3
                            className={`text-[11px] font-bold uppercase tracking-[0.15em] text-ink-primary ${issueStatusMap[status].color}`}
                          >
                            {status.replace("_", " ")}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-white/50 bg-bg-card/50 px-2 py-0.5 rounded border border-primary/20">
                          {columnIssues.length}
                        </span>
                      </div>

                      <div className="h-full z-10">
                        <SortableContext
                          items={columnIssues.map((i) => i.issueId)}
                          strategy={verticalListSortingStrategy}
                        >
                          <DroppableColumn id={status}>
                            <div className="flex flex-col gap-3 min-h-[400px]">
                              {columnIssues.map((issue) => (
                                <SortableIssueCard
                                  key={issue.issueId}
                                  issue={issue}
                                  onClick={(issue) => setSelectedIssue(issue)}
                                  setAiSuggestion={setAiSuggestion}
                                />
                              ))}
                            </div>
                          </DroppableColumn>
                        </SortableContext>
                      </div>
                      <div className="relative top-[-50%] p-4 z-0 rounded-2xl mb-4 z-0 max-w-90 grid grid-cols-1 justify-center items-center border-2 border-dashed border-primary/10 gap-4">
                        <div className="flex justify-center items-center">
                          <IconDragDrop className="w-8 h-8 text-primary/10" />
                        </div>
                        <h3
                          className={
                            "text-[11px] font-bold uppercase tracking-[0.15em] text-primary/10 text-center wrap-anywhere"
                          }
                        >
                          Drag and drop between columns to change status
                        </h3>
                      </div>
                    </div>
                  </Skeleton>
                );
              })}
            </div>

            <InspectionIssue
              selectedIssue={selectedIssue}
              setSelectedIssue={setSelectedIssue}
              onChange={fetchIssueData}
            />
            <StatusConfirm
              confirmStatusOpen={confirmStatusOpen}
              setConfirmStatusOpen={setConfirmStatusOpen}
              statusUpdatingIssue={statusUpdatingIssue}
              setStatusUpdatingIssue={setStatusUpdatingIssue}
              setSelectedIssue={setSelectedIssue}
              selectedIssue={selectedIssue}
              onUpdate={fetchIssueData}
            />

            <AISuggestion
              setAiSuggestion={setAiSuggestion}
              aiSuggestion={aiSuggestion}
            />

            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: {
                    active: {
                      opacity: "0.5",
                    },
                  },
                }),
              }}
            >
              {activeIssue ? (
                <SortableIssueCard
                  issue={activeIssue}
                  onClick={() => {}}
                  isOverlay
                  setAiSuggestion={setAiSuggestion}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>
    </div>
  );
};

export default Kanban;
