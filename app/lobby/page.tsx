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
  const myRooms =
    rooms?.filter(
      (room: Room) =>
        room.status === "in_progress" &&
        (room.player_one_id === user.id || room.player_two_id === user.id)
    ) ?? [];

  return (
    <div className="flex-1 w-full flex flex-col items-center gap-8 p-4">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">Game Lobby</h1>
        <form action={createRoom}>
          <Button type="submit">Create New Room</Button>
        </form>
      </div>

      <div className="w-full max-w-4xl grid gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">My Active Games</h2>
          {myRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRooms.map((room) => (
                <RoomCard key={room.id} room={room} userId={user.id} />
              ))}
            </div>
          ) : (
            <p className="text-foreground/60">No active games.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Waiting for Players</h2>
          {waitingRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {waitingRooms.map((room) => (
                <RoomCard key={room.id} room={room} userId={user.id} />
              ))}
            </div>
          ) : (
            <p className="text-foreground/60">No rooms waiting for players.</p>
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
        <CardTitle>Room</CardTitle>
        <CardDescription className="truncate">ID: {room.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Status: <span className="font-medium">{room.status}</span>
        </p>
        <p className="text-sm">
          Created: {new Date(room.created_at).toLocaleString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/game/${room.id}`}>
            {canJoin ? "Join Game" : "Enter Room"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}