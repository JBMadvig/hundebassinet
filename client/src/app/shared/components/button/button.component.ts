import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Injector, input, linkedSignal, output } from '@angular/core';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
import { ErrorService } from '@services/error.service';

// Define the type attribute of the button we have implementet. (reset and image is not implemented)
type ButtonType = 'button' | 'submit';
// Define the variants of the button we have implementet.
type ButtonVariant = 'solid' | 'subtle' | 'subtle-dark' | 'danger' | 'text' | 'menu-text';
type TextVariant = 'light' | 'primary';

@Component({
    selector: 'app-button',
    imports: [ CommonModule, ReactiveFormsModule ],
    templateUrl: './button.component.html',
    styleUrls: [ './button.component.css' ],
})
@AutoUnsubscribe()
export class ButtonComponent implements AfterViewInit {
    private errorService = inject(ErrorService);
    private injector = inject(Injector);

    /**
     * The text shown inside the button
     *
     * Default is an empty string.
     */
    public label = input<string>('');

    /**
     * The variant of the button. This is used to style the button.
     *
     * Variants are:
     *
     * - `'solid'` (default) - A solid button with a green background color and primary text color
     * - `'subtle'` - A subtle button with a grey border, grey text and no background color
     * - `'subtle-dark'` - A subtle button with a grey-darkish border and dark background color. gray-darkish border and gray-darkish bg when loading or disabled.
     * - `'danger'` - A button with a yellow warning background color
     * - `'text'` - A button with no background color and no border just to display text
     */
    public variant = input<ButtonVariant>('solid');

    /**
     * The type of the button if it's a stand alone button or a submit button for a form.
     */
    public type = input<ButtonType>('button');

    /**
     * Loading state of the button. If true, the button will be disabled and change appearance depending on the variant.
     */
    public loading = input(false);

    /**
     * If boolean attribute is added, then the button will be disabled and users can't interact with it.
     * This is used to disable the button when the form is invalid or when the button is loading.
     */
    public disabled = input<boolean | null>(null);

    /**
     * The icon to be displayed on the button. This can be either a FontAwesome class as a string or just left without if no icon is needed.
     */
    public icon = input<string | null>(null);

    /**
     * The size of the button component.
     *
     * Options are:
     * - `'medium'` (default) - Tailwind classes `py-2 px-3 text-sm`
     * - `'small'` - Tailwind classes `py-1 px-2 text-xs`
     */
    public size = input<'small' | 'medium'>('medium');

    /**
     * If a button is of type 'text', user can have a text variant for the color of the text.
     *
     * Options are:
     * - `'light'` - White text for darker bg primary as the default color
     * - `'primary'` - (default) - Primary text for lighter bg
     */
    public textVariant = input<TextVariant>('primary');

    /**
     * This event is emitted when the button is clicked.
     */
    public handleClick = output<MouseEvent>();

    public isDisabled = linkedSignal(() => this.disabled());

    ngAfterViewInit() {
        if(this.type() === 'submit' && this.disabled() === null) {
            // We conclude we got a form if the type is submit other wise we have implementet the button type="submit" wrong.
            try {
                const formGroupDirective = this.injector.get(FormGroupDirective);
                const form = formGroupDirective.form;
                this.isDisabled.set(form.invalid);

                AutoSub(this).reg['AppButtonFormSup'] = form.valueChanges.subscribe(() => {
                    this.isDisabled.set(form.invalid);
                });
            } catch (error) {
                // @JBMadvig, remove this men going to prod. Make console.error and not handleError, because this is a error that should be fixed in development and not handled in production. We want to know if we have implementet the button wrong and not just handle the error and make the button not work without us knowing why.
                console.error('Error getting FormGroupDirective even if we have a submit type on a button. This likely means that the button is implementet wrong and should be fixed. Please check the implementation of the button component and make sure it is correct.', error);
                // this
                this.errorService.handleError(error, 'Error getting FormGroupDirective even if we have a submit type on a button');
            }
        }
    }

    public onClick(event: MouseEvent) {
        this.handleClick.emit(event);
    }
}
