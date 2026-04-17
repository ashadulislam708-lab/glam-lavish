import * as React from "react"
import { ChevronDownIcon, SearchIcon } from "lucide-react"
import { cn } from "~/lib/utils"

interface SearchableSelectProps {
  value: string;
  onValueChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filtered = React.useMemo(
    () =>
      search.trim() === ""
        ? options
        : options.filter((o) =>
            o.toLowerCase().includes(search.toLowerCase())
          ),
    [options, search]
  )

  // Auto-focus search input when dropdown opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  // Close on click outside
  React.useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleMouseDown)
    }
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [open])

  function handleSelect(option: string) {
    onValueChange(option)
    setSearch("")
    setOpen(false)
  }

  function handleToggle() {
    if (disabled) return
    setOpen((prev) => !prev)
    if (open) setSearch("")
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-muted-foreground"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 opacity-50 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {/* Search input */}
          <div className="flex items-center border-b px-2">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent py-2 pl-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Options list */}
          <ul
            role="listbox"
            className="max-h-48 overflow-y-auto p-1"
          >
            {filtered.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </li>
            ) : (
              filtered.map((option) => (
                <li
                  key={option}
                  role="option"
                  aria-selected={option === value}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelect(option)
                  }}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    option === value && "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  {option}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export { SearchableSelect }
