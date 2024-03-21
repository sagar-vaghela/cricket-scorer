import { Player } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getPlayersByIds } from "@/services/player/getPlayersByIds";

export function usePlayersByIds(ids: Player["id"][][]) {
  const {
    data: players,
    isLoading: arePlayersLoading,
    isFetching: arePlayerFetching,
    refetch: refetchPlayers,
    error: playersError,
  } = useQuery({
    queryKey: ["playersByIds", ids],
    queryFn: () => getPlayersByIds(ids),
    enabled: ids && !!ids.length && ids.some((id) => !!id),
  });

  if (playersError) throw new Error(playersError.message);

  return {
    players,
    arePlayersLoading,
    arePlayerFetching,
    refetchPlayers,
    playersError,
  };
}
