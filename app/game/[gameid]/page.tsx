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
        <h1 className="text-2xl font-bold">Room Not Found</h1>
        <p className="text-foreground/80 max-w-sm">
          The room you are looking for does not exist, has been deleted, or you
          do not have permission to view it. It might also be a temporary sync
          issue.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/lobby">← Back to Lobby</Link>
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
          <Link href="/lobby">← Back to Lobby</Link>
        </Button>
      </div>
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-2xl font-bold">Game Room</h1>
        <p className="text-sm text-foreground/70">ID: {room.id}</p>
      </div>

      <div className="border rounded-lg p-8 w-full max-w-md aspect-square bg-background shadow-lg">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold">Chess Board</h2>
          <p className="text-foreground/60">(Logic to be implemented)</p>
        </div>
      </div>

      <div className="w-full max-w-md text-center flex flex-col gap-4">
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold mb-2">Game Info</h3>
          <p>Status: {room.status}</p>
          <p>Player 1: {room.player_one_id.slice(0, 8)}...</p>
          <p>Player 2: {room.player_two_id?.slice(0, 8) ?? "Waiting..."}</p>
        </div>
        {canJoin && (
          <form action={joinRoom.bind(null, room.id)}>
            <Button type="submit" className="w-full">
              Join Game
            </Button>
          </form>
        )}
        {!isPlayer && room.status !== "waiting" && (
          <p className="text-destructive">This game is already in progress.</p>
        )}
      </div>
    </div>
  );
}