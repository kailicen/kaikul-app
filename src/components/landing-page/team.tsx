import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Client {
  name: string;
  introduction: string;
  avatar: string;
  link: string;
}

interface TeamProps {
  clients: Client[];
}

export function Team({ clients }: TeamProps) {
  return (
    <section
      id="team"
      className="lg:py-18 container mb-4 space-y-6 rounded-lg py-8 dark:bg-transparent"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading font-bold text-3xl sm:text-3xl md:text-6xl">
          Our Team
        </h2>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {clients.map((client) => (
          <div
            className="relative z-0 overflow-hidden rounded-lg bg-slate-50 p-2"
            key={client.name}
          >
            <div className="flex min-h-[250px] flex-col items-center gap-4 rounded-md p-6">
              <Avatar>
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback>{client.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="highlight-underline z-10 text-lg font-bold">
                <a href={client.link} target="_blank" rel="noopener noreferrer">
                  {client.name}
                </a>
              </h3>

              <p className="text-muted-foreground">{client.introduction}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
