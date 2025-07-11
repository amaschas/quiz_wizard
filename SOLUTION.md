# Solution

By Alexander Maschas (alexi.maschas@gmail.com)

## Notes on implementation

My implementation began with a focus on the data modeling and the API design. The boilerplate provided a decent starting point for the build, but required some means of tracking answers to questions and retaining the state of those answers. My approach to tracking answer state was designed to be a simple extension of the existing models, with the following requirements:

* Minimal state: I reasoned that for the current set of user stories, the critical aspects to track were what answer a user had submitted for a question, and which question was "active" for a given quiz.

## (If you didn't go with the boilerplate) Notes on design/architecture and rationale

My solution used the boilerplate for the most part, though I did make one significant change in that I dockerized the setup to ensure it ran smoothly in any environment.

## Feedback for Stepful
_Please feel free to share feedback with us! What you liked or didn't like, how this takehome compares to others you've taken in the past_

## Anything else you'd like us to know?
Not required, but we love learning about what you're passionate about, so if you link us a personal blog or website, or anything else that you've written, we'd love to check them out!
