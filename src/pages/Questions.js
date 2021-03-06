import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAnswer } from "../contexts/answerContext";
import { useQuiz } from "../contexts/quizContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useToast } from "../components/Toast";
import { useRules } from "../contexts/rulesContext";

const Questions = () => {
  const { quizName } = useParams();
  const Navigate = useNavigate();
  const { quiz, setQuiz } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { setAnswers } = useAnswer();
  const { showToast } = useToast();
  const { isRulesAgreed } = useRules();

  useDocumentTitle(`${quizName}'s Questions`);

  useEffect(() => {
    if (!isRulesAgreed) {
      Navigate(`/rules/${quizName}`);
      showToast("info", "Please go through the rules first");
    } else {
      (async () => {
        try {
          const {
            data: { quizes },
          } = await axios.get("/api/quizzes");

          setQuiz(quizes.filter((quiz) => quiz.categoryName === quizName));
        } catch (error) {
          showToast("error", "Something went wrong");
          Navigate("/");
        }
      })();
      setAnswers([]);
    }
  }, [quizName]);

  const clickHandler = (option) => {
    setAnswers((prev) => [...prev, option]);
    if (currentQuestion + 1 === quiz[0].mcqs.length) {
      Navigate(`/result/${quizName}`);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  return (
    <div>
      {quiz.map((data) =>
        data.mcqs.map(
          (item, index) =>
            index === currentQuestion && (
              <div key={item._id} className="questions-container">
                <p className="heading-sm">{data.categoryName}</p>
                <p className="heading-sub">{item.question}</p>
                <button
                  onClick={() => clickHandler(0)}
                  className="button btn-primary"
                >
                  {item.options[0]}
                </button>
                <button
                  onClick={() => clickHandler(1)}
                  className="button btn-primary"
                >
                  {item.options[1]}
                </button>
                <button
                  onClick={() => clickHandler(2)}
                  className="button btn-primary"
                >
                  {item.options[2]}
                </button>
                <button
                  onClick={() => clickHandler(3)}
                  className="button btn-primary"
                >
                  {item.options[3]}
                </button>
              </div>
            )
        )
      )}
    </div>
  );
};

export default Questions;
