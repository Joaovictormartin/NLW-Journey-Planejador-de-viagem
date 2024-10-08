import { toast } from "sonner";
import { FormEvent } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { Calendar, Tag, X } from "lucide-react";

import { TripGet } from "../../../models/trips";
import { Button } from "../../../components/button";
import { usePostActivities } from "../../../hooks/activities";

interface Props {
  trip: TripGet | undefined;
  closeCreateActivityModalOpen: () => void;
}

export function CreateActivityModal({ trip, closeCreateActivityModalOpen }: Props) {
  const { tripId } = useParams();
  const { mutateAsync: postActivities } = usePostActivities();

  const handleCreateActivity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const title = data.get("title")?.toString();
    const occurs_at = data.get("occurs_at")?.toString();

    if (!title) {
      toast.warning("Por favor adicione uma atividade");
      return;
    }
    if (!occurs_at) {
      toast.warning("Por favor selecione uma data");
      return;
    }

    await postActivities({ tripId, title, occurs_at });
    closeCreateActivityModalOpen();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>
            <X
              onClick={closeCreateActivityModalOpen}
              className="text-zinc-400 size-5 cursor-pointer"
            />
          </div>

          <p className="text-sm text-zinc-400">Todos convidados podem visualizar as atividades. </p>
        </div>

        <form onSubmit={handleCreateActivity} className="space-y-3">
          <div className="p-2.5 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2.5">
            <Tag className="size-5 text-zinc-400" />
            <input
              name="title"
              placeholder="Qual a atividade?"
              className="flex-1 bg-transparent outline-none text-lg placeholder-zinc-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2.5 h-14 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-1 items-center gap-2.5">
              <Calendar className="size-5 text-zinc-400" />
              <input
                name="occurs_at"
                type="datetime-local"
                placeholder="Data e horário da atividade"
                className="flex-1 bg-transparent outline-none text-lg placeholder-zinc-400"
                max={format(new Date(trip?.ends_at ? trip?.ends_at : ""), "yyyy-MM-dd'T'HH:mm")}
                min={format(new Date(trip?.starts_at ? trip?.starts_at : ""), "yyyy-MM-dd'T'HH:mm")}
              />
            </div>
          </div>

          <Button type="submit" size="full">
            Salvar atividade
          </Button>
        </form>
      </div>
    </div>
  );
}
