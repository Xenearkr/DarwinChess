import { joinRoom } from "@/lib/actions/room";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function GamePage({
  params,
}: {
  params: { gameId: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/game/${params.gameId}`);
  }

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", params.gameId)
    .single();

  if (error) {
    console.error("Error fetching room:", error);
  }

  if (!room) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold">未找到房间</h1>
        <p className="text-foreground/80 max-w-sm">
          您查找的房间不存在、已被删除，或者您没有权限查看。这也可能是一个临时的同步问题。
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/lobby">← 返回大厅</Link>
        </Button>
      </div>
    );
  }

  const isPlayerOne = room.player_one_id === user.id;
  const isPlayerTwo = room.player_two_id === user.id;
  const isPlayer = isPlayerOne || isPlayerTwo;
  const canJoin = room.status === "waiting" && !isPlayerOne;

  return (
    <div className="flex-1 w-full flex flex-col items-center gap-8 p-4">
      <div className="w-full max-w-4xl">
        <Button asChild variant="outline">
          <Link href="/lobby">← 返回大厅</Link>
        </Button>
      </div>
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-2xl font-bold">游戏室</h1>
        <p className="text-sm text-foreground/70">ID: {room.id}</p>
      </div>

      <div className="border rounded-lg p-8 w-full max-w-md aspect-square bg-background shadow-lg">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold">棋盘</h2>
          <p className="text-foreground/60">(逻辑待实现)</p>
        </div>
      </div>

      <div className="w-full max-w-md text-center flex flex-col gap-4">
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold mb-2">对局信息</h3>
          <p>状态: {room.status}</p>
          <p>玩家一: {room.player_one_id.slice(0, 8)}...</p>
          <p>
            玩家二: {room.player_two_id?.slice(0, 8) ?? "等待中..."}
          </p>
        </div>
        {canJoin && (
          <form action={joinRoom.bind(null, room.id)}>
            <Button type="submit" className="w-full">
              加入对局
            </Button>
          </form>
        )}
        {!isPlayer && room.status !== "waiting" && (
          <p className="text-destructive">该对局已在进行中。</p>
        )}
      </div>
    </div>
  );
}