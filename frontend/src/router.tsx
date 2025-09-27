import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import RootLayout from "./layouts/RootLayout.tsx";
import StoryGenerator from "./pages/StoryGenerator.tsx";
import StoryGeneratorNew from "./pages/StoryGeneratorNew.tsx";
import StoryGeneratorSaved from "./pages/StoryGeneratorSaved.tsx";
import StoryGeneratorView from "./pages/StoryGeneratorView.tsx";
import StoryGeneratorResult from "./pages/StoryGeneratorResult.tsx";
import BoardGameRuleInspector from "./pages/BoardGameRuleInspector.tsx";
import BoardGameSessionChat from "./pages/BoardGameSessionChat.tsx";
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

const storyGeneratorNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story-generator/new",
  component: StoryGeneratorNew,
});

const storyGeneratorSavedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story-generator/saved",
  component: StoryGeneratorSaved,
});

const savedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/saved",
  component: StoryGeneratorSaved,
});

const storyGeneratorViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story-generator/view/$storyId",
  component: StoryGeneratorView,
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  storyGeneratorRoute,
  storyGeneratorNewRoute,
  storyGeneratorSavedRoute,
  savedRoute,
  storyGeneratorViewRoute,
  storyGeneratorResultRoute,
  boardGameRuleInspectorRoute,
  boardGameSessionRoute,
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
