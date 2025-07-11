import type React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type {
  ApiUser,
  ApiQuiz,
  ApiQuizQuestion,
  ApiActiveAnswer,
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
import { Progress } from "@/components/ui/progress";
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
import { QuizNavigation } from "@/components/quizNavigation"
import { QuizOptions } from "@/components/quizOptions"
import { getAnswerData, checkQuizComplete, shuffleArray} from "@/lib/utils";

const USER_ID = 1;

export interface AnswerChangeArgs {
  user_id: number;
  quiz_id: number;
  question_id: number;
  question_answer_index?: number;
  sec_on_question?: number;
}

export const QuizAnswerChoice: React.FC = (props: {selected: boolean}) => {
  const { selected } = props;
  return (
    <li>
      <Checkbox checked={selected} />
    </li>
  )
}

const getQuizProgress = (quiz: ApiQuiz, activeAnswer: ApiActiveAnswer): { current: number, total: number } => {
  const current = quiz?.questions.findIndex(question => question.id === activeAnswer.quiz_question_id);

  return {
    current,
    total: quiz?.questions?.length || 0
  }
}

export const QuizPage: React.FC = () => {
	const { id } = useParams();
	if (!id) throw new Error("Quiz id param is required");

	const [user, setUser] = useState<ApiUser | null>(null);
  const [quiz, setQuiz] = useState<ApiQuiz | null>(null);
	const [activeAnswer, setActiveAnswer] = useState<ApiActiveAnswer | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<ApiQuizQuestion | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<ApiActiveAnswer[] | []>([]);
  const [shuffledChoices, setShuffledChoices] = useState<AppQuizAnswerChoice[]>([]);
  const [doShuffle, setdoShuffle] = useState<boolean>(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
	const [error, setError] = useState<Error | null>(null);

  const activeAnswerSet = activeAnswer === null || Object.keys(activeAnswer).length !== 0;

  // Fetch the quiz data and set the state value
  const fetchQuiz = async () => {
    const res = await fetch(quizApiUrl({ quiz_id: id }), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

		if (!res.ok) throw new Error("Failed to fetch quiz");

		const quiz = await res.json();
    setQuiz(quiz)
  }

  // Fetch the user's active answer to the current quiz and set the state value
  const fetchActiveAnswer = async () => {
    const res = await fetch(quizActiveAnswerApiUrl({ user_id: USER_ID, quiz_id: id, }), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

		if (!res.ok) throw new Error("Failed to fetch active answer");

		const activeAnswerData = await res.json();
    setActiveAnswer(activeAnswerData)
  }

  // Fetch all of the user's answers to the current quiz and set the state value
  const fetchQuizAnswers = async () => {
    const res = await fetch(quizAnswersApiUrl({ user_id: USER_ID, quiz_id: id, }), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

		if (!res.ok) throw new Error("Failed to fetch quiz answers");

		const quizAnswersData = await res.json();
    setQuizAnswers(quizAnswersData)
  }

  // Update an activeAnswer record, the fetch the updated record
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

  // Fetch the user record and update the state value
  const fetchUser = async () => {
    const res = await fetch(userApiUrl({ user_id: USER_ID }), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

		if (!res.ok) throw new Error("Failed to fetch quiz answers");

		const userData = await res.json();
    setUser(userData)
  }

  // Update the user record to indicate the user has completed the quiz
  const setQuizComplete = async (args: {user_id: number, quiz_id: string}) => {
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

  // Fetch the quiz and active answer
	useEffect(() => {
		fetchQuiz();
		fetchActiveAnswer();
	}, [id]);

  // When the user is updated, fetch the user's quiz answers
  // This ensures that the quiz results page gets the updated
  // set of the user's answers when the user record is updated
  // to set the quiz to complete for that user.
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

    // If we have all of the necessary resources, grab the active
    // question from the array of quiz questions and shuffle the choices.
    if (quiz && activeAnswer && Object.keys(activeAnswer).length) {
      const question = getAnswerData(activeAnswer, quiz.questions);
      setActiveQuestion(question);
      if (doShuffle && question?.quiz_answer_choices) {
        const shuffled = shuffleArray(question?.quiz_answer_choices);
        setShuffledChoices(shuffled);
        setdoShuffle(false);
      }
    }
  }, [quiz, activeAnswer]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setSecondsElapsed((prev: number) => prev + 5);
  //   }, 5000);

  //   return () => clearInterval(intervalId);
  // }, []); // only set up once

  // useEffect(() => {
  //   if (activeAnswer) {
  //     handleAnswerChange({
  //       user_id: USER_ID,
  //       quiz_id: id,
  //       question_id: quiz.questions[0].id,
  //       sec_on_question: secondsElapsed
  //     });
  //   }
  // }, [secondsElapsed]);

  // useEffect(() => {
  //   if (activeAnswer && quiz && activeQuestion && activeAnswer.quiz_question_id !== activeQuestion?.id) {
  //     setSecondsElapsed(0);
  //   }
  // }, [activeAnswer]);

  // console.log(secondsElapsed)

	if (error)
		return (
			<div className="text-red-500 p-4">
				<p className="font-bold mb-1">An error has occurred:</p>
				<p>{error.message}</p>
			</div>
		);

	if (!quiz || !activeAnswer || !activeQuestion) return <div className="text-center p-8">Loading...</div>;

  if (checkQuizComplete(user, id)) return <QuizResults quiz={quiz} answers={quizAnswers} />

  const quizProgress = getQuizProgress(quiz, activeAnswer);

	return (
		<Card className="w-[600px] mx-auto">
			<CardHeader className="pb-8">
				<CardTitle>Quiz #{quiz.id}: {quiz.title}</CardTitle>
			</CardHeader>
      <QuizOptions
        user={user}
        quiz={quiz}
        activeAnswer={activeAnswer}
        activeQuestion={activeQuestion}
        shuffledChoices={shuffledChoices}
        handleAnswerChange={handleAnswerChange}
      />
      <QuizNavigation
        user={user}
        quiz={quiz}
        activeAnswer={activeAnswer}
        setQuizComplete={setQuizComplete}
        fetchUser={fetchUser}
        setdoShuffle={setdoShuffle}
        handleAnswerChange={handleAnswerChange}
      />
      <CardContent>
        <Progress value={quizProgress?.current / quizProgress?.total * 100} />
        <CardDescription>Question #{quizProgress?.current + 1} of {quizProgress?.total}</CardDescription>
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
