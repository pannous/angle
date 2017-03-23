import * as sched from 'sched';
import * as time from 'time';
import * as english_parser from 'english_parser';
class Event {
}
class Observer {
    constructor(condition, action) {
        this.condition = condition;
        this.action = action;
    }
}
class Interval {
    constructor(kind, fromy, to, unit) {
        this.kind = kind;
        this.fromy = fromy;
        this.to = to;
        this.unit = unit;
    }
}

//# sourceMappingURL=events.js.map
