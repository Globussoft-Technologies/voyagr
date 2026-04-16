import { Suspense } from "react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
