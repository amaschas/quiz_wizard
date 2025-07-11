import type React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type {
  ApiUser,
  ApiQuiz,
  ApiQuizQuestion,
  ApiActiveAnswer,
  AppQuizQuestion,
  AppQuizAnswerChoice
} from "@/components/quiz";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  quizApiUrl,
  quizActiveAnswerApiUrl,
  quizSubmitAnswerApiUrl,
  quizAnswersApiUrl,
  userApiUrl,
  userSetQuizCompleteApiUrl,
  rootPath
} from "@/paths";
import { QuizResults } from "@/components/quizResults";

export interface AnswerChangeArgs {
  user_id: string;
  quiz_id: string;
  question_id: number;
  question_answer_index?: number;
  ms_on_question?: number;
}

export const getAnswerData = (activeAnswer: ApiActiveAnswer, quizQuestions: ApiQuizQuestion[]): AppQuizQuestion => {
  const { quiz_question_id } = activeAnswer;
  const activeQuestion = quizQuestions.find(question => question.id === quiz_question_id);
  const formattedAnswerChoices = activeQuestion?.quiz_answer_choices.split(";;").map((choice, index) => ({
    id: index,
    value: choice,
  }));

  return {
    ...activeQuestion,
    quiz_answer_choices: formattedAnswerChoices
  };
}

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

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]; // copy to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const QuizAnswerChoice: React.FC = (props: {choice: AppQuizAnswerChoice, selected: boolean}) => {
  const { choice, selected } = props;
  return (
    <li>
      <Checkbox checked={selected} />
    </li>
  )
}

export const QuizPage: React.FC = () => {
  const USER_ID = "1";
	const { id } = useParams();
	if (!id) throw new Error("Quiz id param is required");

	const [user, setUser] = useState<ApiUser | null>(null);
  const [quiz, setQuiz] = useState<ApiQuiz | null>(null);
	const [activeAnswer, setActiveAnswer] = useState<ApiActiveAnswer | {} | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<ApiQuizQuestion | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<ApiActiveAnswer[] | []>([]);
  const [shuffledChoices, setShuffledChoices] = useState<AppQuizAnswerChoice[]>([]);
  const [doShuffle, setdoShuffle] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

  const activeAnswerSet = activeAnswer === null || Object.keys(activeAnswer).length !== 0;

  const fetchQuiz = async () => {
    const res = await fetch(quizApiUrl({ quiz_id: id }), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

		if (!res.ok) throw new Error("Failed to fetch quiz");

		const quiz = await res.json();
    setQuiz(quiz)
  }

  const fetchActiveAnswer = async () => {
    const res = await fetch(quizActiveAnswerApiUrl({ user_id: USER_ID, quiz_id: id, }), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

		if (!res.ok) throw new Error("Failed to fetch active answer");

		const activeAnswerData = await res.json();
    console.log("activeAnswerData", activeAnswerData)
    setActiveAnswer(activeAnswerData)
  }

  const fetchQuizAnswers = async () => {
    const res = await fetch(quizAnswersApiUrl({ user_id: USER_ID, quiz_id: id, }), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

		if (!res.ok) throw new Error("Failed to fetch quiz answers");

		const quizAnswersData = await res.json();
    setQuizAnswers(quizAnswersData)
  }

  const handleAnswerChange = async (args: AnswerChangeArgs) => {
    try {
      const res = await fetch(quizSubmitAnswerApiUrl({}), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...args
        }),
      });

      if (!res.ok) throw new Error("Failed to submit answer");

      fetchActiveAnswer();

    } catch (err) {
      setError(err as Error);
    }
  };

  const fetchUser = async () => {
    const res = await fetch(userApiUrl({ user_id: USER_ID }), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

		if (!res.ok) throw new Error("Failed to fetch quiz answers");

		const userData = await res.json();
    setUser(userData)
  }

  const setQuizComplete = async (args: {user_id: string, quiz_id: string}) => {
    try {
      const res = await fetch(userSetQuizCompleteApiUrl({}), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...args
        }),
      });

      if (!res.ok) throw new Error("Failed to set quiz complete");

      fetchActiveAnswer();

    } catch (err) {
      setError(err as Error);
    }
  };

	useEffect(() => {
		fetchQuiz();
		fetchActiveAnswer();
	}, [id]);

  	useEffect(() => {
		fetchQuizAnswers();
	}, [user]);

  useEffect(() => {
    fetchUser();
  
    // If we have a quiz but not active answer
    // activate the first answer in the quiz
    if (quiz && !activeAnswerSet) {
      handleAnswerChange({
        user_id: USER_ID,
        quiz_id: id,
        question_id: quiz.questions[0].id,
      })
    }

    if (quiz && activeAnswer && Object.keys(activeAnswer).length) {
      const question = getAnswerData(activeAnswer, quiz.questions);
      setActiveQuestion(question);
      if (doShuffle) {
        const shuffled = shuffleArray(question?.quiz_answer_choices);
        setShuffledChoices(shuffled);
        setdoShuffle(false);
      }
    }
  }, [quiz, activeAnswer]);

	if (error)
		return (
			<div className="text-red-500 p-4">
				<p className="font-bold mb-1">An error has occurred:</p>
				<p>{error.message}</p>
			</div>
		);

	if (!quiz || !activeAnswer || !activeQuestion) return <div className="text-center p-8">Loading...</div>;

  console.log("quizAnswers", quizAnswers)

  if (checkQuizComplete(user, id)) return <QuizResults quiz={quiz} answers={quizAnswers} />

	return (
		<Card className="w-[600px] mx-auto">
			<CardHeader className="pb-8">
				<CardTitle>Quiz #{quiz.id}: {quiz.title}</CardTitle>
			</CardHeader>
      <CardContent><CardDescription>Quiz Question #</CardDescription></CardContent>
      <CardContent>
        {activeQuestion.question_content}
        <ul className="quiz-choices">
          { shuffledChoices.map((choice => (
            <li key={`choice-${choice?.id}`}>
              <Checkbox
                checked={choice.id === activeAnswer.quiz_question_answer_index}
                onCheckedChange={() => handleAnswerChange({
                  user_id: USER_ID,
                  quiz_id: id,
                  question_id: activeQuestion.id,
                  question_answer_index: choice.id
                })}
              />
              <Label>{ choice.value }</Label>
            </li>
          ))) }
        </ul>
      </CardContent>
      <CardContent>
        <Button
          disabled={activeAnswer.quiz_question_answer_index === null}
          onClick={() =>{
            const nextQuestionId = getAdjacentQuestionId(activeAnswer.quiz_question_id, quiz.questions, "next")
            if (nextQuestionId < 0) {
              setQuizComplete({user_id: USER_ID, quiz_id: id});
              fetchUser();
            } else {
              setdoShuffle(true)
              handleAnswerChange({
                user_id: USER_ID,
                quiz_id: id,
                question_id: nextQuestionId
              });
            }
          }}>
          Submit
        </Button>
        <Button disabled={activeAnswer.quiz_question_id === quiz.questions[0].id} >
          Back
        </Button>
      </CardContent>
			<CardFooter className="flex justify-between pt-8">
				<Link
					to={rootPath.pattern}
					className="text-muted-foreground hover:text-blue-600"
				>
					Back to home page
				</Link>
			</CardFooter>
		</Card>
	);
}
