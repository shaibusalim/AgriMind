import { Leaf } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="AgriMind Home">
      <Leaf className="h-7 w-7 text-sidebar-primary" />
      <h1 className="text-xl font-bold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        AgriMind
      </h1>
    </div>
  );
}
