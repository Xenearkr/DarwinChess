"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const INITIAL_FEN =
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1";

export async function createRoom() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: room, error } = await supabase
    .from("rooms")
    .insert({
      player_one_id: user.id,
      current_turn: user.id,
      board_state:
        "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating room:", error);
    return redirect("/lobby?error=Could not create room");
  }

  if (room) {
    redirect(`/game/${room.id}`);
  } else {
    redirect("/lobby?error=Failed to create room and get its ID");
  }
}

export async function joinRoom(roomId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { error } = await supabase
    .from("rooms")
    .update({
      player_two_id: user.id,
      status: "in_progress",
    })
    .eq("id", roomId);

  if (error) {
    console.error("Error joining room:", error);
    return redirect(`/game/${roomId}?error=Could not join room`);
  }

  revalidatePath(`/game/${roomId}`);
  revalidatePath("/lobby");
  redirect(`/game/${roomId}`);
}