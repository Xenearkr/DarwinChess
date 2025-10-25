import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LocalGamePage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center gap-8 p-4">
      <div className="w-full max-w-4xl">
        <Button asChild variant="outline">
          <Link href="/lobby">← 返回大厅</Link>
        </Button>
      </div>
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-2xl font-bold">本地游戏</h1>
        <p className="text-sm text-foreground/70">与您自己对战或与朋友在同一台设备上对战</p>
      </div>

      <div className="border rounded-lg p-8 w-full max-w-md aspect-square bg-background shadow-lg">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold">棋盘</h2>
          <p className="text-foreground/60">(逻辑待实现)</p>
        </div>
      </div>
    </div>
  );
}