import type React from "react";

import {
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type {
  ApiUser,
  ApiQuiz,
  ApiActiveAnswer,
} from "@/components/quiz";
import type { AnswerChangeArgs } from "@/pages/quiz";
import { getAdjacentQuestionId } from "@/lib/utils";

export const QuizNavigation: React.FC = (props: {
  user: ApiUser,
  quiz: ApiQuiz,
  activeAnswer: ApiActiveAnswer,
  setQuizComplete: (args: {user_id: number, quiz_id: string}) => void,
  fetchUser: () => void,
  setdoShuffle: (doShuffle: boolean) => void,
  handleAnswerChange: (args: AnswerChangeArgs) => void,
}) => {
  const {
    user,
    quiz,
    activeAnswer,
    setQuizComplete,
    fetchUser,
    setdoShuffle,
    handleAnswerChange
  } = props;
  
  return (
    <CardContent>
      <Button
        className="back-button"
        disabled={activeAnswer.quiz_question_id === quiz.questions[0].id}
        onClick={() =>{
          const prevQuestionId = getAdjacentQuestionId(activeAnswer.quiz_question_id, quiz.questions, "prev")
          if (activeAnswer.quiz_question_id > 0) {
            setdoShuffle(true)
            handleAnswerChange({
              user_id: user.id,
              quiz_id: quiz.id,
              question_id: prevQuestionId
            });
          }
        }}>
        Back
      </Button>
      <Button
        disabled={activeAnswer.quiz_question_answer_index === null}
        onClick={() =>{
          const nextQuestionId = getAdjacentQuestionId(activeAnswer.quiz_question_id, quiz.questions, "next")
          if (nextQuestionId < 0) {
            setQuizComplete({user_id: user.id, quiz_id: quiz.id});
            fetchUser();
          } else {
            setdoShuffle(true)
            handleAnswerChange({
              user_id: user.id,
              quiz_id: quiz.id,
              question_id: nextQuestionId
            });
          }
        }}>
        Submit
      </Button>
    </CardContent>
  );
}