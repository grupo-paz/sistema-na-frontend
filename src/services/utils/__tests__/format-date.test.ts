import { formatDate } from "../format-date";

describe('formatDate', () => {
  describe('when formatting a valid ISO date string', () => {
    it('should format date to Brazilian locale with timezone', () => {
      const isoDate = '2023-10-15T14:30:45.000Z';
      const result = formatDate(isoDate);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
    });

    it('should handle date with different time', () => {
      const isoDate = '2023-12-25T09:15:30.000Z';
      const result = formatDate(isoDate);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
    });

    it('should format midnight correctly', () => {
      const isoDate = '2023-01-01T00:00:00.000Z';
      const result = formatDate(isoDate);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
    });
  });

  describe('when formatting date without timezone', () => {
    it('should handle date string without Z suffix', () => {
      const isoDate = '2023-06-15T16:45:20';
      const result = formatDate(isoDate);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
    });
  });

  describe('when provided with invalid date string', () => {
    it('should return original string for invalid date', () => {
      const invalidDate = 'invalid-date-string';
      const result = formatDate(invalidDate);
      expect(result).toBe(invalidDate);
    });

    it('should return original string for empty string', () => {
      const emptyDate = '';
      const result = formatDate(emptyDate);
      expect(result).toBe(emptyDate);
    });

    it('should return original string for malformed ISO date', () => {
      const malformedDate = '2023-13-45T25:70:80.000Z';
      const result = formatDate(malformedDate);
      expect(result).toBe(malformedDate);
    });
  });

  describe('when formatting edge case dates', () => {
    it('should handle leap year date', () => {
      const leapYearDate = '2024-02-29T12:00:00.000Z';
      const result = formatDate(leapYearDate);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
    });

    it('should handle year 2000', () => {
      const y2kDate = '2000-01-01T00:00:00.000Z';
      const result = formatDate(y2kDate);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
    });
  });

  describe('when formatting dates with milliseconds', () => {
    it('should handle dates with milliseconds', () => {
      const dateWithMs = '2023-07-20T10:30:45.123Z';
      const result = formatDate(dateWithMs);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
    });
  });
});
