import type React from "react";

import {
	CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import type {
  ApiUser,
  ApiQuiz,
  ApiActiveAnswer,
  ApiQuizQuestion
} from "@/components/quiz";
import type { AnswerChangeArgs } from "@/pages/quiz";

export const QuizOptions: React.FC = (props: {
  user: ApiUser,
  quiz: ApiQuiz,
  activeAnswer: ApiActiveAnswer,
  activeQuestion: ApiQuizQuestion,
  shuffledChoices: ApiQuizQuestion[],
  handleAnswerChange: (args: AnswerChangeArgs) => void,
}) => {
  const {
    user,
    quiz,
    activeAnswer,
    activeQuestion,
    shuffledChoices,
    handleAnswerChange
  } = props;
  
  return (
    <CardContent>
      {activeQuestion.question_content}
      <ul className="quiz-choices">
        { shuffledChoices.map(((choice: AppQuizAnswerChoice) => (
          <li
            key={`choice-${choice?.id}`}
            onClick={() => handleAnswerChange({
              user_id: user.id,
              quiz_id: quiz.id,
              question_id: activeQuestion.id,
              question_answer_index: choice.id
            })}
          >
            <Checkbox
              checked={ choice.id === activeAnswer.quiz_question_answer_index }
            />
            <Label>{ choice.value }</Label>
          </li>
        ))) }
      </ul>
    </CardContent>
  );
}