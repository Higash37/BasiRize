package com.basirize;

record Fraction(int numerator, int denominator) {

    Fraction {
        if (denominator == 0) {
            throw new IllegalArgumentException("分母を0にはできない");
        }
        if (denominator < 0) {
            numerator = -numerator;
            denominator = -denominator;
        }
        // 約分する
        int g = greatestCommonDivisor(Math.abs(numerator), denominator);
        numerator = numerator / g;
        denominator = denominator / g;
    }

    private static int greatestCommonDivisor(int a, int b) {
        while (b != 0) {
            int remainder = a % b;
            a = b;
            b = remainder;
        }
        return a;
    }

    Fraction apply(Operator operator, Fraction other) {
        return switch (operator) {
            case ADD -> add(other);
            case SUBTRACT -> subtract(other);
            case MULTIPLY -> multiply(other);
            case DIVIDE -> divide(other);
        };
    }

    Fraction add(Fraction other) {
        return new Fraction(
                numerator * other.denominator + other.numerator * denominator,
                denominator * other.denominator);
    }

    Fraction subtract(Fraction other) {
        return new Fraction(
                numerator * other.denominator - other.numerator * denominator,
                denominator * other.denominator);
    }

    Fraction multiply(Fraction other) {
        return new Fraction(
                numerator * other.numerator,
                denominator * other.denominator);
    }

    Fraction divide(Fraction other) {
        if (other.numerator == 0) {
            throw new IllegalArgumentException("0で割れない");
        }
        return new Fraction(
                numerator * other.denominator,
                denominator * other.numerator);
    }

    String text() {
        if (denominator == 1) {
            return String.valueOf(numerator);
        }
        return numerator + "/" + denominator;
    }
}
