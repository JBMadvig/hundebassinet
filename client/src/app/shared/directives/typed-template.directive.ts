import { Directive, input } from '@angular/core';

@Directive({
    selector: 'ng-template[appTypedTemplate]',
    standalone: true,
})
export class TypedTemplateDirective<T> {

    public appTypedTemplate = input.required<T>();

    // This is a workaround for the lack of type inferance for data in Angular templates.
    static ngTemplateContextGuard<T>(dir: TypedTemplateDirective<T>, ctx: unknown): ctx is T {
        return true;
    }
}
