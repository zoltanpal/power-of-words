import { Loader2 } from "lucide-react";

type LoadingProps = {
    text?: string
}

export default function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <span className="ml-2 text-lg text-muted-foreground">{text}</span>
    </div>
  )
}