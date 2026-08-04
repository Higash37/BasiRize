package com.basirize;

// JUnit 5が提供してるテストメソッドだよという目印
// @Testというアノテーションの場所
import org.junit.jupiter.api.Test;
// assertTrueなど判定用の関数をまとめて読み込む
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.HashSet;

// テスト用のクラス
// publicは付けない
class ArithmeticProblemGeneratorTest {
    @Test
    void generateNumberReturnsValueWithinRange() {
        Random random = new Random();
        for (int i = 0; i < 100; i++) {
            int number = ArithmeticProblemGenerator.generateNumber(1, 10, random);
            assertTrue(number >= 1 && number <= 10);
        }
    }

    @Test
    void subtractionAnswerAreCorrect() {
        List<Problem> problems = ArithmeticProblemGenerator.generateProblems(1, 10, 20, "引き算", true);
        for (Problem p : problems) {
            assertEquals(p.operand1() - p.operand2(), p.answer());
        }
    }

    @Test
    void additionAnswerAreCorrect() {
        List<Problem> problems = ArithmeticProblemGenerator.generateProblems(1, 10, 20, "足し算", false);
        for (Problem p : problems) {
            assertEquals(p.operand1() + p.operand2(), p.answer());
        }
    }

    @Test
    void generateProblemsReturnsRequestedCount() {
        List<Problem> problems = ArithmeticProblemGenerator.generateProblems(1, 10, 5, "引き算", false);
        assertEquals(5, problems.size());
    }

    @Test
    void subtractionAnswersAreNeverNegativeWhenNotAllowed() {
        List<Problem> problems = ArithmeticProblemGenerator.generateProblems(1, 10, 20, "引き算", false);
        for (Problem p : problems) {
            assertTrue(p.answer() >= 0);
        }
    }

    @Test
    void generateProblemsHasNoDuplicateQuestions() {
        List<Problem> problems = ArithmeticProblemGenerator.generateProblems(1, 10, 30, "引き算", false);
        Set<String> uniqueQuestions = new HashSet<>();
        for (Problem p : problems) {
            uniqueQuestions.add(p.question());
        }
        assertEquals(problems.size(), uniqueQuestions.size());
    }

    @Test
    void generateProblemsWorksWhenMinEqualsMax() {
        List<Problem> problems = ArithmeticProblemGenerator.generateProblems(5, 5, 1, "足し算", false);
        Problem p = problems.get(0);
        assertEquals(5, p.operand1());
        assertEquals(5, p.operand2());
        assertEquals(10, p.answer());
    }

}