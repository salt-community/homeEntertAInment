import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import RootLayout from "./layouts/RootLayout.tsx";
import StoryGenerator from "./pages/StoryGenerator.tsx";
import BoardGameRuleInspector from "./pages/BoardGameRuleInspector.tsx";
import MovieMood from "./pages/MovieMood.tsx";
import QuizGenerator from "./pages/QuizGenerator.tsx";
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

const quizGeneratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz-generator",
  component: QuizGenerator,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storyGeneratorRoute,
  boardGameRuleInspectorRoute,
  movieMoodRoute,
  quizGeneratorRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
