type BadgeProps = {
  label: string;
  type: "priority" | "status" | "sla";
};

export default function Badge({ label, type }: BadgeProps) {
  let className = "badge ";

  if (type === "priority") {
    className += label.toLowerCase();
  }

  if (type === "status") {
    className += `status-${label.toLowerCase()}`;
  }

  if (type === "sla") {
    className += `sla-${label.toLowerCase()}`;
  }

  return <span className={className}>{label}</span>;
}