import type { GetAroundKind } from "@/content/properties";

const icons: Record<GetAroundKind, React.ReactNode> = {
  rail: (
    <path d="M7 3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm-3 8h16M8 21l2-4m6 4-2-4M8.5 14h.01M15.5 14h.01" />
  ),
  bus: (
    <path d="M6 3h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm-2 7h16M7 18v3m10-3v3M8 14h.01M16 14h.01" />
  ),
  trail: <path d="M5 21c3-4 1-7 5-9s6-4 4-9M14 21c1-2 3-3 5-3M4 9c2 0 3 1 4 3" />,
  park: <path d="M12 3c-3 0-5 2.5-5 5.5 0 2 1 3.5 2.5 4.3V17h5v-4.2C16 12 17 10.5 17 8.5 17 5.5 15 3 12 3Zm0 14v4M8 21h8" />,
};

export function GetAroundIcon({ kind }: { kind: GetAroundKind }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy-100 text-navy-700">
      <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {icons[kind]}
      </svg>
    </span>
  );
}

export function GetAroundList({ items }: { items: { kind: GetAroundKind; title: string; detail: string }[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-navy-100">
          <GetAroundIcon kind={item.kind} />
          <div className="min-w-0">
            <p className="font-semibold text-navy-900">{item.title}</p>
            <p className="mt-1 text-base">{item.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
