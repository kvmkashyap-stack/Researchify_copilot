"use client";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-sm leading-6 text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}