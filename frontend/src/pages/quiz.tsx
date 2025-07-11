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
import { getAnswerData, checkQuizComplete, getAdjacentQuestionId, shuffleArray} from "@/lib/utils";

const USER_ID = 1;

export interface AnswerChangeArgs {
  user_id: number;
  quiz_id: number;
  question_id: number;
  question_answer_index?: number;
  ms_on_question?: number;
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
        <Button
          disabled={activeAnswer.quiz_question_id === quiz.questions[0].id}
          onClick={() =>{
            const prevQuestionId = getAdjacentQuestionId(activeAnswer.quiz_question_id, quiz.questions, "prev")
            if (activeAnswer.quiz_question_id > 0) {
              setdoShuffle(true)
              handleAnswerChange({
                user_id: USER_ID,
                quiz_id: id,
                question_id: prevQuestionId
              });
            }
          }}>
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
