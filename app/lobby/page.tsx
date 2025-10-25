import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Room } from "@/lib/types";
import Link from "next/link";
import { createRoom } from "@/lib/actions/room";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthButton } from "@/components/auth-button";

export default async function LobbyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rooms", error);
  }

  const waitingRooms =
    rooms?.filter((room: Room) => room.status === "waiting") ?? [];

  return (
    <div className="flex-1 w-full flex flex-col items-center gap-8 p-4">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">游戏大厅</h1>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>

      <div className="w-full max-w-4xl grid gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">单人游戏</h2>
          <Button asChild className="w-full md:w-auto">
            <Link href="/game/local">开始本地游戏</Link>
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">当前房间</h2>
            <form action={createRoom}>
              <Button type="submit" variant="outline">
                创建新房间
              </Button>
            </form>
          </div>
          {waitingRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {waitingRooms.map((room) => (
                <RoomCard key={room.id} room={room} userId={user.id} />
              ))}
            </div>
          ) : (
            <p className="text-foreground/60">没有等待加入的房间。</p>
          )}
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, userId }: { room: Room; userId: string }) {
  const isPlayerOne = room.player_one_id === userId;
  const canJoin = room.status === "waiting" && !isPlayerOne;

  return (
    <Card>
      <CardHeader>
        <CardTitle>房间</CardTitle>
        <CardDescription className="truncate">ID: {room.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          状态: <span className="font-medium">{room.status}</span>
        </p>
        <p className="text-sm">
          创建于: {new Date(room.created_at).toLocaleString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/game/${room.id}`}>
            {canJoin ? "加入游戏" : "进入房间"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}