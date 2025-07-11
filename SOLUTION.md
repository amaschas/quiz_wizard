# Solution

By Alexander Maschas (alexi.maschas@gmail.com)

## Notes on implementation

My implementation began with a focus on the data modeling and the API design. The boilerplate provided a decent starting point for the build, but required some means of tracking answers to questions and retaining the state of those answers. I reduced the problem down to two basic requirements:

* Track which question in a given quiz was active for a given user, and which answer was chosen, if any.
* Track whether a given user had completed a given quiz.

When a user lands on a quiz page, the quiz component fetches the following resources and tracks as state via Reacts useState:

* user - The user taking the quiz.
* quiz - The quiz data, including the title, id and an array of quiz questions.
* activeAnswer - A record indicating which option has been chosen by a user for a question in a quiz.

If no activeAnswer is found, the quiz page creates a new activeAnswer record for the first question in the quiz. The activeAnswer records provide the means of proceeding through the quiz. When an activeAnswer record is created or updated, that activeAnswer is set active and all other activeAnswers for that user and quiz are set inactive. When a user selects an answer option, the corresponding activeAnswer record is update to record the choice. The submit and back buttons simply update the adjacent activeAnswer records to set them active, and when the quiz reaches the end, the score page shows the user their scoring information, including the questions, their submitted answers, and whether they got the question correct.

In order to track whether a user has completed a given quiz, I added a field to the user record to track which quizzes that user as completed, using the same data delimitation scheme that was used with the question choices. When a user hits submit on the final question, the user model is updated to reflect that the specified quiz has been completed, and the quiz page will display the results of the quiz.

The quiz component also includes a number of other state objects:

* activeQuestion - Derived from the activeAnswer. Whenever a new activeAnswer is loaded, the question data for the corresponding question is stored in this state variable.
* quizAnswers - Only fetched when the quiz is finished and the quizResults component is displayed. Contains all of the user's activeQuestion records for that quiz, so that the quiz and be scored and the user's answers displayed.
* shuffledChoices - I retained the original design decision to store the correct answer to a question at index 0, which necessitating the shuffling of answer choices when displaying the quiz. This state variable stores the shuffled choices.
* doShuffle - To avoid shuffing the answer choices on every state change, this state variable ensures that choices are only shuffled once per quiz question. Choices will still shuffle on a page reload, but remain static while a user interacts with a given question.

### Component Architecture

My general approach to frontend component architecure adheres to two basic fundamentals:

* Keep state management in one place as much as possible.
* Keep display components as static as possible.

To that end, I generally create controller components that keep track of state, make requests to data sources for CRUD purposes, and pass any needed data or interaction callbacks down into child components. I like to use React's Providers for this generally, but in this case I used the top-level quiz component as a controller. 

## (If you didn't go with the boilerplate) Notes on design/architecture and rationale

My solution used the boilerplate for the most part, though I did make one significant change in that I dockerized the setup to ensure it ran smoothly in any environment.

## Feedback for Stepful

The SQLite migrations didn't run successfully at first, as the syntax for the seeded quiz data was invalid. Other than that everything worked great!

## Anything else you'd like us to know?

Not required, but we love learning about what you're passionate about, so if you link us a personal blog or website, or anything else that you've written, we'd love to check them out!
