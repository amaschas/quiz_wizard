import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type {
  ApiUser,
  ApiQuizQuestion,
  ApiActiveAnswer,
  AppQuizQuestion
} from "@/components/quiz";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getAnswerData = (
  activeAnswer: ApiActiveAnswer,
  quizQuestions: ApiQuizQuestion[]
): AppQuizQuestion => {
  const { quiz_question_id } = activeAnswer;

  const activeQuestion = quizQuestions.find(
    question => question.id === quiz_question_id
  );

  if (!activeQuestion) {
    throw new Error("Active question not found.");
  }

  const formattedAnswerChoices = activeQuestion.quiz_answer_choices
    ?.split(";;")
    .map((choice, index) => ({
      id: index,
      value: choice,
    })) ?? [];

  return {
    ...activeQuestion,
    quiz_answer_choices: formattedAnswerChoices,
  };
};

export const checkQuizComplete = (user: ApiUser, quizId: string): boolean => {
  if (!user?.quizzes_completed) return false;

  const quizComplete = user?.quizzes_completed.split(";;").findIndex((id: string) => {
    return id === quizId
  }) >= 0;
  return quizComplete;
}

export const getAdjacentQuestionId = (
  currentId: number,
  questions: AppQuizQuestion[],
  direction: "next" | "prev"
): number => {
  const currentIndex = questions.findIndex(question => question.id === currentId);

  if (currentIndex === -1) return -1;

  if (direction === "next") {
    return questions[currentIndex + 1]?.id ?? -1;
  }

  if (direction === "prev") {
    return currentIndex === 0 ? currentId : questions[currentIndex - 1].id;
  }

  return -1;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array]; // copy to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}