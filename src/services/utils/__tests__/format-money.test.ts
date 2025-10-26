import { formatMoney } from "../format-money";

describe('Utils: Format Money', () => {
  describe('when formatting a positive number', () => {
    it('should format to Brazilian currency format', () => {
      const result = formatMoney(1234.56);
      expect(result).toContain('R$');
      expect(result).toContain('1.234,56');
    });

    it('should format integers without decimal places', () => {
      const result = formatMoney(1000);
      expect(result).toContain('R$');
      expect(result).toContain('1.000,00');
    });

    it('should format small amounts correctly', () => {
      const result = formatMoney(0.99);
      expect(result).toContain('R$');
      expect(result).toContain('0,99');
    });
  });

  describe('when formatting zero', () => {
    it('should format zero correctly', () => {
      const result = formatMoney(0);
      expect(result).toContain('R$');
      expect(result).toContain('0,00');
    });
  });

  describe('when formatting negative numbers', () => {
    it('should format negative values with minus sign', () => {
      const result = formatMoney(-500.75);
      expect(result).toContain('-');
      expect(result).toContain('R$');
      expect(result).toContain('500,75');
    });
  });

  describe('when formatting large numbers', () => {
    it('should handle thousands correctly', () => {
      const result = formatMoney(1234567.89);
      expect(result).toContain('R$');
      expect(result).toContain('1.234.567,89');
    });

    it('should handle millions correctly', () => {
      const result = formatMoney(1000000);
      expect(result).toContain('R$');
      expect(result).toContain('1.000.000,00');
    });
  });

  describe('when formatting decimal numbers', () => {
    it('should round to two decimal places', () => {
      const result = formatMoney(10.999);
      expect(result).toContain('R$');
      expect(result).toContain('11,00');
    });

    it('should handle very small decimal numbers', () => {
      const result = formatMoney(0.01);
      expect(result).toContain('R$');
      expect(result).toContain('0,01');
    });
  });
});
