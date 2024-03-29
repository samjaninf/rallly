import { cn } from "@rallly/ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@rallly/ui/tooltip";

import { ColoredAvatar } from "@/components/poll/participant-avatar";

interface ParticipantAvatarBarProps {
  participants: { name: string }[];
  max: number;
}

export const ParticipantAvatarBar = ({
  participants,
  max = Infinity,
}: ParticipantAvatarBarProps) => {
  const hiddenCount = participants.length - max;
  return (
    <div className="flex items-center">
      {participants
        .slice(0, hiddenCount === 1 ? max + 1 : max)
        .map((participant, index) => (
          <Tooltip key={index}>
            <TooltipTrigger>
              <ColoredAvatar
                className={cn("select-none ring-2 ring-white", {
                  "-mr-1":
                    index !== max - 1 || index !== participants.length - 1,
                })}
                name={participant.name}
              />
            </TooltipTrigger>
            <TooltipContent>{participant.name}</TooltipContent>
          </Tooltip>
        ))}
      {hiddenCount > 1 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "select-none ring-2 ring-white",
                "rounded-full bg-gray-200 px-1.5 text-xs font-semibold",
                "inline-flex h-5 min-w-[24px] items-center justify-center",
              )}
            >
              +{hiddenCount}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <ul>
              {participants.slice(max, 10).map((participant, index) => (
                <li key={index}>{participant.name}</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
};
