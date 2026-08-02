import java.util.Random;
import java.util.ArrayList;
import java.util.List;

// public: ラベル（アクセス修飾子）。誰が使っていいかを表してる。反対語は private（自分のクラスの中だけ）
// class: キーワード。これから class を書くという宣言。java は全てのコードをこの class の中に書く。
// ArithmeticProblemGenerator: class の名前。ファイル名と一致させる。
// {}: クラスの中身が始まる合図

public class ArithmeticProblemGenerator{
    // static: 修飾子。オブジェクトを作らなくても呼べるという意味。JVMが最初に呼ぶ場所は static。
    // void: 戻り値の型。このメソッドは結果を返さないという意味。
    // main: メソッドの名前。なんかないといけないやつ。
    // (String[] args): 引数（パラメータ）。main メソッドが受け取るデータ。String()は文字列の配列。argsはその名前。

        public static void main(String[] args) {
        int minValue = 1;
        int maxValue = 10;
        int questionCount = 5;
        String operationType = "引き算";
        boolean allowNegative = false;
        List<Problem> problems =
        generateProblems(minValue, maxValue,
            questionCount, operationType,
            allowNegative);
            for (Problem p : problems) {
                System.out.println(p.question());
            }
            for (Problem p : problems) {
                System.out.println("答え：" +
                p.answer());
            }
        }
    private static int generateNumber(int minValue, int maxValue, Random random){
        return random.nextInt(maxValue - minValue + 1) + minValue;
    }
    private static boolean containsQuestion(List<Problem> problems, String question){
        for(Problem p: problems){
            if(p.question().equals(question)){
                return true;
            }
        }
        return false;
    }
    private static List<Problem> generateProblems(int minValue, int maxValue, int questionCount, String operationType, boolean allowNegative){
        Random random = new Random();
        List<Problem> problems = new ArrayList<>();
        for (int i = 0; i <questionCount; i++){
            String question;
            int answer; 
        do{
                int operand1 = generateNumber(minValue, maxValue, random);
                int operand2 = generateNumber(minValue, maxValue, random);
                if(operationType.equals("引き算")){
                    if (!allowNegative && operand1 < operand2) {
                        int temp = operand1;
                        operand1 = operand2;
                        operand2 = temp;                
                    }
                    question = operand1+ "-" + operand2 + "=?";
                    answer = operand1 - operand2;
                } 
                else {
                    question = operand1+ "+" + operand2 + "=?";
                    answer = operand1 + operand2;
                }
            } while(containsQuestion(problems, question));
            problems.add(new Problem(question, answer));
        }
        return problems;
    }
}

record Problem(String question, int answer){}