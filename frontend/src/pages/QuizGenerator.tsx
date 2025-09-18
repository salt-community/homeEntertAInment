import { useState } from "react";
import NewQuizButton from "../components/quiz/NewQuizButton";
import QuizConfigurationForm from "../components/quiz/QuizConfigurationForm";
import type { QuizConfiguration } from "../services/quizService";

export default function QuizGenerator() {
  const [showForm, setShowForm] = useState(false);

  const handleNewQuiz = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (config: QuizConfiguration) => {
    console.log("Quiz configuration submitted:", config);
    // TODO: Implement quiz creation with the configuration
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <h2>Quiz Generator</h2>
      <p>Create custom quizzes tailored to your preferences.</p>
      <div className="mt-4">
        <NewQuizButton onClick={handleNewQuiz} />
      </div>

      {showForm && (
        <QuizConfigurationForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}
