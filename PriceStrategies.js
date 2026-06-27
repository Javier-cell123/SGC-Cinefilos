export class GeneralStrategy {
    calculate(base) { return base; }
}

export class StudentStrategy {
    calculate(base) { return base * 0.8; } // 20% descuento
}

export class PriceContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    getPrice(base) {
        return this.strategy.calculate(base);
    }
}