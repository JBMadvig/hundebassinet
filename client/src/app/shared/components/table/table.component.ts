import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, computed, contentChild, ElementRef, input, TemplateRef, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { AutoSub, AutoUnsubscribe } from '@decorators/auto-unsub.decorator';
import { DeepKeys } from '@lib/utility-types';

export type TableBodyData<T> = {$implicit: T, index: number};
export type TableHeaderData<T> = { title: string, field: DeepKeys<T> | null }[];

@AutoUnsubscribe()
@Component({
    selector: 'app-table',
    imports: [ CommonModule ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.css',
})
export class TableComponent<T extends ({id: string} | {key: string})> {

    /**
     * The data to be displayed in the table.
     */
    public data = input.required<T[]>();

    /**
     * Whether to apply manual row styling or not.
     * This is needed when you add more than one row per data item, which breaks the default styling.
     */
    public manualRowStyle = input(false, { transform: booleanAttribute });

    /**
     * The headers to be displayed in the table.
     * - `title` is the title of the header.
     * - `field` should be a key of the data object and is used to sort the table.
     */
    public headerTemplateRef = contentChild<TemplateRef<TableHeaderData<T>>>('headerTemplate');
    public headerTemplate = computed(() => this.headerTemplateRef() ?? null);

    /**
     * The template to be used for each row.
     * This is a template reference, not a component reference.
     *
     * NB: Include same number of <td> elements as headers.
     */
    public rowTemplateRef = contentChild<TemplateRef<TableBodyData<T>>>('rowTemplate');
    public rowTemplate = computed(() => this.rowTemplateRef() ?? null);

    /**
     * The template to be used when there is no data.
     * This is a template reference, not a component reference.
     *
     * This should be a `div` element which will span all columns.
     */
    public noDataTemplateRef = contentChild<TemplateRef<void>>('noDataTemplate');
    public noDataTemplate = computed(() => this.noDataTemplateRef() ?? null);

    /**
     * We need to add a trackBy to the data, so Angular can track the data properly.
     * Depending on if id or key is provided in the data, we use that to track the data.
     */

    public optionsWithTrackBy = computed(() => {
        return this.data().map((option) => {
            const trackByValue = ('key' in option) ? option.key : option.id;
            return {
                ...option,
                trackByValue,
            };
        });
    });

    public wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapper');

    constructor() {
        // Scroll to top when data changes.
        AutoSub(this).reg['scrollToTopSub'] = toObservable(this.data).subscribe(() => {
            this.wrapper()?.nativeElement.scrollTo({ top: 0 });
        });
    }

}
