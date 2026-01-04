import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-counter',
    imports: [
        CommonModule,
    ],
    templateUrl: './counter.component.html',
    styleUrl: './counter.component.css',
})
export class CounterComponent {

    public currentCount = input.required<number>();
    public limit = input<number | null>(null);

    public countUp = output<number>();
    public countDown = output<number>();

    public onCountUp() {
        const limit = this.limit();
        if (limit === null || this.currentCount() < limit) {
            this.countUp.emit(this.currentCount() + 1);
        }
        // Maybe implement some feedback when limit is reached
    }

    public onCountDown() {
        if (this.currentCount() > 0) {
            this.countDown.emit(this.currentCount() - 1);
        }
    }

}
