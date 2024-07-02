import type { StepTitle } from "@/types/text/StepTitle";

export default function StepTitle({ title }: StepTitle) {
  return <h1 className="text-xl">{title}</h1>;
}
