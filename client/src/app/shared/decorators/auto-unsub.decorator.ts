import { SubscriptionLike } from 'rxjs';

type SubscriptionMap = { [key: string]: SubscriptionLike };
interface AutoSubComponent {
    getAutoSub(): AutoSubClass;
}

export function AutoSub(component: unknown): AutoSubClass {
    return AutoSubClass.getInstance(component);
}

/**
 * Automatically unsubscribe from all subscriptions when the component is destroyed.
 * New subscritiptions must be registered in the `reg` property of the `AutoSubClass` instance.
 * eg: `AutoSub(this).reg['mySub'] = this.myObservable.subscribe()`
 * 'mySub' is the name of the subscription and can be anything you want but must be unique within
 * the component.
 */
export function AutoUnsubscribe() {
    return function (constructor: { new(): unknown }) {
        const original = constructor.prototype.ngOnDestroy;

        constructor.prototype.getAutoSub = function (): AutoSubClass {
            if (!this.autoSub) {
                const newAutoSub = new AutoSubClass();
                newAutoSub.id = constructor.name;
                this.autoSub = newAutoSub;
            }
            return this.autoSub;
        };

        constructor.prototype.ngOnDestroy = function () {
            if (isAutoSubComponent(this)) {
                this.getAutoSub().unsubscribe();
            }

            if (original && typeof original === 'function') {
                original.apply(this);
            }
        };
    };
}

class AutoSubClass {
    public id = 'unnamed';

    public static getInstance(component: unknown): AutoSubClass {
        if (!isAutoSubComponent(component)) {
            throw new Error('AutoSubClass not found! Did you remember to add the @AutoUnsubscribe() decorator?');
        }
        return component.getAutoSub();
    }

    public reg: SubscriptionMap = new Proxy({}, {
        set: (target: SubscriptionMap, prop: string, val: SubscriptionLike) => {
            if (target[prop] && !target[prop].closed) {
                console.warn(`Replacing existing subscription for "${prop}" in "${this.id}"`);
                target[prop].unsubscribe(); // Unsubscribe existing before replacing
            }
            target[prop] = val;
            return true;
        },
    });

    public unsubscribe(): void {
        Object.values(this.reg).forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}

function isAutoSubComponent(obj: unknown): obj is AutoSubComponent {
    if (typeof obj === 'object') {
        const component = obj as Partial<AutoSubComponent>;
        return typeof component.getAutoSub === 'function';
    }
    return false;
}
