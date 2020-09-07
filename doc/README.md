# Language runtime

-   jargons:

    -   work: execution of piece of code
    -   management: deciding when and where work should be done.
    -   worker: one who does work
    -   manager: one who manages
    -   person: thread in computer context

The runtime of this language consists of one manager and at least one worker (a manager is a worker too).

A worker may delay his work, to do so the worker must collect copy of all the information that's needed to do the work.

### Code

```

    function f(data: type) {
        // do something
    }
    function z(data: type) {
        fire f (data)
    }
```
