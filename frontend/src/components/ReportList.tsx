/**
 * File: src/components/ReportList.tsx
 * Module: Components
 * Responsibility: Renders a titled list inside an evaluation report
 */

type ReportListProps = {
  title: string
  items: string[]
}

export function ReportList({ title, items }: ReportListProps) {
  return (
    <section className="report-list">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}