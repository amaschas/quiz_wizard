import { QuizzesList, type ApiQuiz} from "@/components/quiz";
import { quizzesApiUrl } from "@/paths";
import { useEffect, useState } from "react";

export function RootPage() {
  const [quizzes, setQuizzes] = useState<ApiQuiz[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(quizzesApiUrl({}))
      .then((res) => res.json())
      .then(setQuizzes)
      .catch(setError);
  }, []);

  if (error) return <div>An error has occurred: {error.message}</div>;

  if (!quizzes) return <div className="text-center p-8">Loading...</div>;

  return (
    <>
      <div className="text-xl text-muted-foreground mt-5">Welcome back!</div>
      <div className="mt-10 text-lg text-center">
        <QuizzesList quizzes={quizzes} />
      </div>
    </>
  );
}
