import { Dialog, DialogContent } from "../ui/dialog";
import { CurPlayer, Match } from "@prisma/client";
import { useTeamById } from "@/hooks/api/team/useTeamById";
import { usePlayersByIds } from "@/hooks/api/player/usePlayersByIds";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { TypographyH3 } from "../ui/typography";
import { Dispatch, SetStateAction, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface SelectBowlerProps {
  match: Match;
  open: boolean;
  curPlayers: CurPlayer[];
  setCurPlayers: Dispatch<SetStateAction<CurPlayer[]>>;
  handleSave: (_: unknown, updatedCurPlayers?: CurPlayer[]) => void;
  handleUndo: () => void;
}

function SelectBowler({
  open,
  match,
  handleSave,
  handleUndo,
  curPlayers,
  setCurPlayers,
}: SelectBowlerProps) {
  const { team } = useTeamById(match?.teamIds[Number(!match.curTeam)]!);
  const { players } = usePlayersByIds([team?.playerIds!]);

  const schema = z.object({
    playerId: z.enum(team?.playerIds as any, {
      required_error: "You need to select a notification type.",
      invalid_type_error: "invalid_type_error",
    }),
  });

  const defaultBowler = curPlayers.find(
    (player) => player.type === "bowler",
  )?.id;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      playerId: defaultBowler,
    },
  });

  const { handleSubmit, watch, reset } = form;

  function onSubmit(data: z.infer<typeof schema>) {
    const newBowler = {
      id: data.playerId,
      type: "bowler",
    };

    setCurPlayers((prev) => [
      ...prev.filter((curPlayer) => curPlayer.type === "batsman"),
      newBowler,
    ]);

    handleSave(0, [newBowler]);

    setTimeout(reset, 500);
  }

  useEffect(() => {
    if (open)
      reset({
        playerId: defaultBowler,
      });
  }, [open]);

  useEffect(() => {
    watch("playerId");
  }, [watch("playerId")]);

  // TODO: Bowled last over
  // TODO: Update isModified state on submit
  // TODO: Openable manually
  // TODO: New reusable component for player label

  return (
    <Dialog open={open}>
      <DialogContent removeCloseButton>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <TypographyH3 className="text-2xl font-bold">
              Select Bowler
            </TypographyH3>
            {!!match?.curPlayers.find((player) => player.type === "bowler") && (
              <Button variant="destructive" onClick={handleUndo}>
                Undo
              </Button>
            )}
          </div>
          <Form {...form}>
            {/* TODO: Search field HERE to filter players */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="playerId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {players?.[0].map((player) => {
                          const isSelected = field.value?.includes(player.id);
                          const isBothSelected = field.value?.length === 1;
                          return (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value={player.id}
                                  className="sr-only"
                                />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  "flex h-8 w-full items-center justify-between bg-muted p-2 font-normal",
                                  {
                                    "bg-emerald-500 font-bold text-emerald-950":
                                      isSelected,
                                    "opacity-50": isBothSelected && !isSelected,
                                  },
                                )}
                              >
                                {player.name}
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>Submit</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SelectBowler;
