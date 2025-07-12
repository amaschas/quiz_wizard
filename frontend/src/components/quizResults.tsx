import { Link } from "react-router-dom";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
  CardFooter,
	CardTitle,
} from "@/components/ui/card";
import type {
  ApiQuiz,
  ApiActiveAnswer
} from "@/components/quiz";
import { rootPath } from "@/paths";
import { getAnswerData } from "@/lib/utils";

const getQuizQuestionAnswer = (questionId: number, answers: ApiActiveAnswer[]) => {
  return answers.find(answer => answer.quiz_question_id === questionId);
};

const getNumberCorrect = (answers: ApiActiveAnswer[]) => {
  return answers.reduce((count, answer) => {
    return answer.quiz_question_answer_index === 0 ? count + 1 : count;
  }, 0);
};

export const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(" ");
};

const getTotalTimeSpent = (answers: ApiActiveAnswer[]) => {
  const totalSeconds = answers.reduce((count, answer) => {
    return count + answer.sec_on_question;
  }, 0);
  return formatTime(totalSeconds);
};

const Correct = () => (
  <span className="correct">
    {String.fromCharCode(10003)}
  </span>
)

const Incorrect = () => (
  <span className="incorrect">
    x
  </span>
)

interface QuizResultsProps {
  quiz: ApiQuiz;
  answers: ApiActiveAnswer[];
}

export const QuizResults = ({ quiz, answers }: QuizResultsProps) => {
  return quiz && answers.length ? (
    <Card>
      <CardHeader className="pb-8">
        <CardTitle>Quiz #{quiz.id}: {quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>Quiz Complete!</CardContent>
      <CardContent>
        <CardDescription>You got {getNumberCorrect(answers)}  out of { quiz?.questions?.length } correct!</CardDescription>
        <CardDescription>You spent {getTotalTimeSpent(answers)}  on this quiz</CardDescription>
      </CardContent>
      <CardContent>
      <ul>
        { quiz.questions?.map((question, index) => {
          const answer = getQuizQuestionAnswer(question.id, answers);
          const answerData = answer ? getAnswerData(answer, [question]) : null;
          return (
            <li key={`answer-${question.id}`}>
              {`#${index + 1}: ${question?.question_content} - ${
                answerData?.quiz_answer_choices?.[answer?.quiz_question_answer_index || 0]?.value ?? "(no answer)"
              }`}
              { answer?.quiz_question_answer_index === 0 ? <Correct /> : <Incorrect /> }
            </li>
          );
        })}
      </ul>
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
  ) : null;
}