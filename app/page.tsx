import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>达尔文象棋</Link>
            </div>
            {hasEnvVars && <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 items-center">
          <div className="flex flex-col gap-8 items-center">
            <h1 className="text-5xl font-bold">在线玩中国象棋</h1>
            <p className="text-lg text-center text-foreground/80">
              加入或创建一个游戏室，开始与他人对战。
            </p>
            {hasEnvVars && (
              <Link
                href="/lobby"
                className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                前往大厅
              </Link>
            )}
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            由{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>{" "}
            强力驱动
          </p>
        </footer>
      </div>
    </main>
  );
}