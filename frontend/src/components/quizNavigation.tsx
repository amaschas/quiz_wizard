import type {
  ApiUser,
  ApiQuiz,
  ApiActiveAnswer,
} from "@/components/quiz";
import type { AnswerChangeArgs } from "@/pages/quiz";

import {
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdjacentQuestionId } from "@/lib/utils";

interface QuizNavigationProps {
  user: ApiUser;
  quiz: ApiQuiz;
  activeAnswer: ApiActiveAnswer;
  secondsElapsed: number;
  setQuizComplete: (args: { user_id: number; quiz_id: number }) => void;
  fetchUser: () => void;
  setDoShuffle: (doShuffle: boolean) => void;
  handleAnswerChange: (args: AnswerChangeArgs) => void;
  updateAnswerDuration: (questionId: number, numSeconds: number) => void;
  setSecondsElapsed: (secondsElapsed: number) => void;
}

export const QuizNavigation = ({
  user,
  quiz,
  activeAnswer,
  secondsElapsed,
  setQuizComplete,
  fetchUser,
  setDoShuffle,
  handleAnswerChange,
  updateAnswerDuration,
  setSecondsElapsed,
}: QuizNavigationProps) => {
  return activeAnswer && quiz && quiz?.questions ? (
    <CardContent>
      <Button
        className="back-button"
        disabled={quiz?.questions && activeAnswer?.quiz_question_id === quiz?.questions[0].id}
        onClick={async () =>{
          // Get the previous question ID
          const prevQuestionId = getAdjacentQuestionId(activeAnswer?.quiz_question_id, quiz?.questions, "prev")
          if (activeAnswer?.quiz_question_id > 0) {
            // Enabled shuffling for the next question
            setDoShuffle(true);

            // Update the answer duration and the set the next questi0n active serially
            try {
              await updateAnswerDuration(
                activeAnswer?.quiz_question_id,
                activeAnswer?.sec_on_question + secondsElapsed
              );
              await handleAnswerChange({
                user_id: user?.id,
                quiz_id: quiz?.id,
                question_id: prevQuestionId
              });
            } catch (err) {
              console.error("Failed to update answers in sequence", err);
            }

            // Reset seconds elapsed
            setSecondsElapsed(0);
          }
        }}>
        Back
      </Button>
      <Button
        disabled={activeAnswer.quiz_question_answer_index === null}
        onClick={ async () =>{
          // Get the next question ID
          const nextQuestionId = getAdjacentQuestionId(activeAnswer?.quiz_question_id, quiz?.questions, "next");

          // If we're on the last question (nextQuestionId === -1)
          if (nextQuestionId < 0) {
            // Update the duration of the last question
            await updateAnswerDuration(
              activeAnswer?.quiz_question_id,
              activeAnswer?.sec_on_question + secondsElapsed
            );

            // Set the quiz complete and then fetch the user, which
            // triggers the fetching of the completed answers
            setQuizComplete({user_id: user.id, quiz_id: quiz.id});
            fetchUser();
          } else {
            // Enabled shuffling for the previous question
            setDoShuffle(true)

            // Update the answer duration and the set the previous question active serially
            try {
              await updateAnswerDuration(
                activeAnswer?.quiz_question_id,
                activeAnswer?.sec_on_question + secondsElapsed
              );

              await handleAnswerChange({
                user_id: user?.id,
                quiz_id: quiz?.id,
                question_id: nextQuestionId
              });
            } catch (err) {
              console.error("Failed to update answers in sequence", err);
            }

            // Reset seconds elapsed
            setSecondsElapsed(0);
          }
        }}>
        Submit
      </Button>
    </CardContent>
  ) : null;
}