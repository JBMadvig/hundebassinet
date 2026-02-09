import { ErrorHandler, inject, Injectable } from '@angular/core';

import { ErrorService } from './error.service';

// This is the service triggered by Angular when an error occurs in the application.
// Right now (21.1.0), we can not inject this service into a component, because it will be
// instantiated by again by Angular, and the instance in the component will be different.
// * This means that any updates to signals triggered in the `handleError` method will not be
// * received by the component.
//
// If you want to trigger something in a component when an error occurs, you can use
// the ErrorService, which is a service that can be injected into a component.
@Injectable()
export class InternalErrorHandler implements ErrorHandler {
    private errorService = inject(ErrorService);
    handleError(error: unknown): void {
        this.errorService.handleError(error);
    }
}
