import { HttpErrorResponse } from '@angular/common/http';

import { describeProblem, problemField, setProblemTranslator } from './problem-detail';

describe('describeProblem', () => {
  afterEach(() => setProblemTranslator((key) => key));

  it('does not expose technical JSON binding errors or the generic ASP.NET title', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: {
        title: 'One or more validation errors occurred.',
        errors: {
          Phone: ['The JSON value could not be converted to System.Int32.'],
        },
      },
    });

    expect(describeProblem(error, 'Fallback')).toBe('Fallback');
    expect(describeProblem(error, 'Fallback')).not.toContain('System.Int32');
  });

  it('keeps readable validation while hiding technical JSON binding details', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: {
        title: 'One or more validation errors occurred.',
        errors: {
          request: ['The request field is required.'],
          '$': ['The JSON value could not be converted to System.Byte[].'],
        },
      },
    });

    expect(describeProblem(error, 'Fallback')).toBe(
      'request: The request field is required.',
    );
    expect(describeProblem(error, 'Fallback')).not.toContain('System.Byte');
  });

  it('preserves plain-text errors returned by an API', () => {
    const error = new HttpErrorResponse({
      status: 409,
      error: 'Profiles already associated with another family: 123',
    });

    expect(describeProblem(error, 'Fallback')).toBe(
      'Profiles already associated with another family: 123',
    );
  });

  it('translates a known error and identifies its form field', () => {
    setProblemTranslator((key) => key === 'errors.backend.plateExists' ? 'Plate already registered' : key);
    const error = new HttpErrorResponse({ status: 409, error: { detail: 'Plate already exists.' } });
    expect(describeProblem(error, 'Fallback')).toBe('Plate already registered');
    expect(problemField(error)).toBe('plate');
  });
});
