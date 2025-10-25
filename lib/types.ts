export type Room = {
  id: string;
  created_at: string;
  status: "waiting" | "in_progress" | "completed";
  player_one_id: string;
  player_two_id: string | null;
  current_turn: string | null;
  board_state: string;
  winner_id: string | null;
};