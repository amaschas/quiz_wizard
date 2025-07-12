import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { quizPath, userApiUrl } from "@/paths";
import { checkQuizComplete } from "@/lib/utils";

export interface ApiUser {
    id: number;
    name: string;
    email: string;
    quizzes_completed: string;
};

export interface ApiQuiz {
  id: number;
  title: string;
  questions: ApiQuizQuestion[];
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

const USER_ID = 1;

const QuizItem = ({ title, id }: ApiQuiz, user: ApiUser) => {
  const quizComplete = checkQuizComplete(user, `${id}`);

  return (
    <TableRow key={`quiz-${id}`}>
      <TableCell>{id}</TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>
        <Button asChild>
          <Link to={quizPath({ id: id.toString() })}>{ quizComplete ? "View Results" : "Take Quiz" }</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export const QuizzesList = ({ quizzes }: { quizzes: ApiQuiz[] }) => {
  const [user, setUser] = useState<ApiUser | null>(null);

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

  useEffect(() => {
		fetchUser();
	}, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{quizzes.map((quiz) => QuizItem(quiz, user))}</TableBody>
    </Table>
  );
}
