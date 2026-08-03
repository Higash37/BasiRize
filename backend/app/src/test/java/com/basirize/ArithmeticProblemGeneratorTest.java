package com.basirize;
// JUnit 5が提供してるテストメソッドだよという目印
// @Testというアノテーションの場所
import org.junit.jupiter.api.Test;
// assertTrueなど判定用の関数をまとめて読み込む
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Random;

// テスト用のクラス
// publicは付けない
class ArithmeticProblemGeneratorTest {
    @Test
    void generateNumberReturnsValueWithinRange(){
        Random random = new Random();
        for (int i = 0; i < 100; i++){
            int number = ArithmeticProblemGenerator.generateNumber(1, 10, random);
            assertTrue(number >= 1 && number <= 10);
        }
    }

    @Test
    void subtractionAnswerAreCorrect(){
        List<Problem> problems = ArithmeticProblemGenerator.generateProblems(1, 10, 20, "引き算", true);
        for (Problem p: problems){
            assertEquals(p.operand1() - p.operand2(), p.answer());
        }
    }

    @Test
    void additionAnswerAreCorrect(){
        List<Problem> problems = ArithmeticProblemGenerator.generateProblems(1, 10, 20, "足し算", false);
        for (Problem p: problems){
            assertEquals(p.operand1() + p.operand2(), p.answer());
        }
    }
}