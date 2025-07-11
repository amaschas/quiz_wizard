import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { quizPath } from "@/paths";
import { Link } from "react-router-dom";

export interface ApiUser {
    id: number;
    name: string;
    email: string;
    quizzes_completed: string;
};

export interface ApiQuiz {
  id: number;
  title: string;
  questions?: ApiQuizQuestion[];
};

export interface ApiQuizQuestion {
  id: number;
  quiz_id: number;
  question_content: string;
  quiz_answer_choices: string;
};

export interface ApiActiveAnswer {
  user_id: number;
  quiz_id: number;
  quiz_question_id: number;
  quiz_question_answer_index: number;
  is_active: boolean;
  sec_on_question: number;
};

export interface AppQuizQuestion {
  id: number;
  quiz_id: number;
  question_content: string;
  quiz_answer_choices?: AppQuizAnswerChoice[];
};

export interface AppQuizAnswerChoice {
  id: number;
  value: string;
}

const QuizItem = ({ title, id }: ApiQuiz) => {
  return (
    <TableRow key={`quiz-${id}`}>
      <TableCell>{id}</TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>
        <Button asChild>
          <Link to={quizPath({ id: id.toString() })}>Take quiz</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export const QuizzesList = ({ quizzes }: { quizzes: ApiQuiz[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{quizzes.map((quiz) => QuizItem(quiz))}</TableBody>
    </Table>
  );
}
