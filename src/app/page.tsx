export default function Home() {
  return (
    <main className="flex gap-10 justify-between flex-col min-h-screen pt-36 container">
      <div className="space-y-10 max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="sm:text-5xl text-4xl font-semibold tracking-tighter">
            GitHub Stats Generator
          </h1>
          <p className="text-muted-foreground md:text-base text-sm">
            Generate your GitHub stats for your README with ease!
          </p>
        </div>
      </div>
    </main>
  );
}
