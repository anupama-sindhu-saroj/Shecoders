import React, { useState, useEffect } from 'react';

// Simple inline styles for layout (no Tailwind)
const styles = {
  container: { fontFamily: 'sans-serif', background: '#000', color: '#fff', minHeight: '100vh', padding: '20px' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#4F46E5' },
  subTitle: { fontSize: '18px', color: '#aaa' },
  scoreCard: { background: '#111', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-around', marginBottom: '20px' },
  statBox: { background: '#222', padding: '15px', borderRadius: '10px', textAlign: 'center', flex: 1, margin: '0 5px' },
  statValue: { fontSize: '24px', fontWeight: 'bold' },
  chartContainer: { width: '150px', height: '150px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  questionCard: { background: '#111', padding: '15px', marginBottom: '10px', borderRadius: '8px' },
  correct: { color: '#10B981' },
  wrong: { color: '#EF4444' },
  unanswered: { color: '#F59E0B' },
  button: { padding: '10px 20px', margin: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' },
};

const ResultPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchResult = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/results?quizId=${quizId}&attemptId=${attemptId}`
      );
      const data = await res.json();
      setResult(data.submission);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching result:', err);
      setLoading(false);
    }
  };
  fetchResult();
}, [quizId, attemptId]); // re-run if these change


  if (loading) return <div style={styles.container}>Loading...</div>;
  if (!result) return <div style={styles.container}>No result found.</div>;

  const totalQuestions = result.questions.length;
  const correctCount = result.answers.filter(a => a.isCorrect).length;
  const wrongCount = result.answers.filter(a => !a.isCorrect && a.chosenOptions.length > 0).length;
  const unansweredCount = totalQuestions - correctCount - wrongCount;

  const correctPercent = (correctCount / totalQuestions) * 100;
  const wrongPercent = (wrongCount / totalQuestions) * 100;
  const unansweredPercent = (unansweredCount / totalQuestions) * 100;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Quiz Result: {result.quizId.title}</h1>
        <p style={styles.subTitle}>Attempt ID: {result._id}</p>
      </div>

      {/* Score Card */}
      <div style={styles.scoreCard}>
        <div style={styles.statBox}>
          <div>Total Score</div>
          <div style={styles.statValue}>{result.totalScore} / {result.maxScore}</div>
        </div>
        <div style={styles.chartContainer}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{Math.round((correctCount / totalQuestions) * 100)}%</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>Accuracy</div>
          </div>
        </div>
        <div style={styles.statBox}>
          <div>Grade</div>
          <div style={styles.statValue}>{result.grade}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <div style={styles.statBox}><div>Correct</div><div style={{...styles.statValue, color: '#10B981'}}>{correctCount}</div></div>
        <div style={styles.statBox}><div>Wrong</div><div style={{...styles.statValue, color: '#EF4444'}}>{wrongCount}</div></div>
        <div style={styles.statBox}><div>Unanswered</div><div style={{...styles.statValue, color: '#F59E0B'}}>{unansweredCount}</div></div>
      </div>

      {/* Question Review */}
      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Question Review</h2>
        {result.questions.map(q => {
          const status = q.isCorrect ? 'correct' : q.chosenAnswer ? 'wrong' : 'unanswered';
          const color = status === 'correct' ? styles.correct : status === 'wrong' ? styles.wrong : styles.unanswered;
          return (
            <div key={q.id} style={styles.questionCard}>
              <div>
                <strong>Q{q.id}:</strong> {q.text}
              </div>
              <div>
                Your Answer: <span style={color}>{q.chosenAnswer || 'N/A'}</span>
              </div>
              {q.isCorrect === false && q.correctAnswer && (
                <div>
                  Correct Answer: <span style={{ color: '#3B82F6' }}>{q.correctAnswer}</span>
                </div>
              )}
              {q.explanation && (
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#aaa' }}>
                  Explanation: {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultPage;
