import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import RootLayout from "./layouts/RootLayout.tsx";
import {
  StoryGenerator,
  StoryGeneratorNew,
  StoryGeneratorSaved,
  StoryGeneratorView,
  StoryGeneratorResult,
} from "./pages/story";
import BoardGameRuleInspector from "./pages/BoardGameRuleInspector.tsx";
import BoardGameSessionChat from "./pages/BoardGameSessionChat.tsx";
import MovieMood from "./pages/MovieMood.tsx";
import QuizIndex from "./pages/Quiz/index.tsx";
import QuizCreate from "./pages/Quiz/create.tsx";
import Quiz from "./pages/Quiz/quiz.tsx";
import QuizList from "./pages/Quiz/list.tsx";
import MyQuizzes from "./pages/Quiz/my-quizzes.tsx";
import Home from "./pages/Home.tsx";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story",
  component: StoryGenerator,
});

const storyNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story/new",
  component: StoryGeneratorNew,
});

const storySavedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story/saved",
  component: StoryGeneratorSaved,
});

const savedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/saved",
  component: StoryGeneratorSaved,
});

const storyViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story/view/$storyId",
  component: StoryGeneratorView,
});

const storyResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story/result",
  component: StoryGeneratorResult,
});

const boardGameRuleInspectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/board-game-rule-inspector",
  component: BoardGameRuleInspector,
});

const boardGameSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/board-game-rule-inspector/session/$sessionId",
  component: BoardGameSessionChat,
});

const movieMoodRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/movie-mood",
  component: MovieMood,
});

const quizIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: QuizIndex,
});

const quizCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz/create",
  component: QuizCreate,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz/play",
  component: Quiz,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      quizId: (search.quizId as string) || undefined,
    };
  },
});

const quizListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz/list",
  component: QuizList,
});

const myQuizzesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz/my-quizzes",
  component: MyQuizzes,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storyRoute,
  storyNewRoute,
  storySavedRoute,
  savedRoute,
  storyViewRoute,
  storyResultRoute,
  boardGameRuleInspectorRoute,
  boardGameSessionRoute,
  movieMoodRoute,
  quizIndexRoute,
  quizCreateRoute,
  quizRoute,
  quizListRoute,
  myQuizzesRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
