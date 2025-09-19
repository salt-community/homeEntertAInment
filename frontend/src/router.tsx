import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import RootLayout from "./layouts/RootLayout.tsx";
import StoryGenerator from "./pages/StoryGenerator.tsx";
import BoardGameRuleInspector from "./pages/BoardGameRuleInspector.tsx";
import MovieMood from "./pages/MovieMood.tsx";
import QuizIndex from "./pages/Quiz/index.tsx";
import QuizCreate from "./pages/Quiz/create.tsx";
import Quiz from "./pages/Quiz/quiz.tsx";
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

const boardGameRuleInspectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/board-game-rule-inspector",
  component: BoardGameRuleInspector,
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  storyGeneratorRoute,
  boardGameRuleInspectorRoute,
  movieMoodRoute,
  quizIndexRoute,
  quizCreateRoute,
  quizRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
