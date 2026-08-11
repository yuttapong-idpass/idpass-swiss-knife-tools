import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { LucideIcon } from "lucide-react";

export type ToolAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Native tooltip, usually the editor's own description of the action. */
  title?: string;
  active?: boolean;
  disabled?: boolean;
  destructive?: boolean;
};

export type ToolGroup = {
  id: string;
  actions: ToolAction[];
};

type Props = {
  groups: ToolGroup[];
};

const JsonToolPanel = ({ groups }: Props) => {
  return (
    <aside className="json-tool-panel w-full lg:w-56 shrink-0 flex flex-col rounded-lg border border-border bg-sidebar overflow-hidden">
      <div className="px-3 py-2.5 border-b border-border shrink-0">
        <p className="text-sm font-semibold text-sidebar-foreground">
          JSON Tools
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-2 flex flex-col gap-1">
        {groups.map((group, groupIndex) => (
          <React.Fragment key={group.id}>
            {groupIndex > 0 && <Separator className="my-1.5" />}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
              {group.actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant={action.active ? "secondary" : "ghost"}
                    size="sm"
                    onClick={action.onClick}
                    title={action.title}
                    disabled={action.disabled}
                    aria-pressed={action.active}
                    className={`w-full justify-start font-normal ${
                      action.destructive
                        ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                        : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="truncate">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
};

export default JsonToolPanel;
