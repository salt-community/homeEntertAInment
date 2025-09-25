import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import RootLayout from "./layouts/RootLayout.tsx";
import StoryGenerator from "./pages/StoryGenerator.tsx";
import StoryGeneratorResult from "./pages/StoryGeneratorResult.tsx";
import BoardGameRuleInspector from "./pages/BoardGameRuleInspector.tsx";
import BoardGameSessionChat from "./pages/BoardGameSessionChat.tsx";
import MovieMood from "./pages/MovieMood.tsx";
import QuizIndex from "./pages/Quiz/index.tsx";
import QuizCreate from "./pages/Quiz/create.tsx";
import Quiz from "./pages/Quiz/quiz.tsx";
import QuizList from "./pages/Quiz/list.tsx";
import Home from "./pages/Home.tsx";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const storyGeneratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story-generator",
  component: StoryGenerator,
});

const storyGeneratorResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story-generator/result",
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
});

const quizListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz/list",
  component: QuizList,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storyGeneratorRoute,
  storyGeneratorResultRoute,
  boardGameRuleInspectorRoute,
  boardGameSessionRoute,
  movieMoodRoute,
  quizIndexRoute,
  quizCreateRoute,
  quizRoute,
  quizListRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
