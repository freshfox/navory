export class Calculator {

    static add(a, b) {
        a = this.toCents(a);
        b = this.toCents(b);
        return (a + b) / 100;
    }

    static sub(a, b) {
        return this.add(a, b * (-1));
    }

    static mult(a, b) {
        return (this.toCents(a) * this.toCents(b)) / 100;
    }

    static toCents(number) {
        if (number === undefined) {
            return 0;
        }

        return Math.round(number * 100);
    }

}
