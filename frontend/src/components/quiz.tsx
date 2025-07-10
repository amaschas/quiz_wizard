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

function QuizItem({ title, id }: Quiz) {
	return (
		<TableRow>
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

export type Quiz = {
	id: number;
	title: string;
};

export function QuizzesList({ quizzes }: { quizzes: Quiz[] }) {
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
