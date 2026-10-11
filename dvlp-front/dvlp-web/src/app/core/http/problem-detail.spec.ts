import { HttpErrorResponse } from '@angular/common/http';

import { describeProblem } from './problem-detail';

describe('describeProblem', () => {
  it('prefers validation errors over the generic ASP.NET title', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: {
        title: 'One or more validation errors occurred.',
        errors: {
          Phone: ['The JSON value could not be converted to System.Int32.'],
        },
      },
    });

    expect(describeProblem(error, 'Fallback')).toBe(
      'Phone: The JSON value could not be converted to System.Int32.',
    );
  });

  it('shows the JSON binding error before ASP.NET’s generic required-request error', () => {
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
      '$: The JSON value could not be converted to System.Byte[].',
    );
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
});
