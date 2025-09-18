import NewQuizButton from '../components/quiz/NewQuizButton'

export default function QuizGenerator() {
  const handleNewQuiz = () => {
    // TODO: Implement new quiz functionality
    console.log('Create new quiz button clicked')
  }

  return (
    <div>
      <h2>Quiz Generator</h2>
      <p>Coming soon.</p>
      <div className="mt-4">
        <NewQuizButton onClick={handleNewQuiz} />
      </div>
    </div>
  )
}


