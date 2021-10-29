# Course Introduction

## Mocking
* testing a single unit of code in isolation
* component depends on many deps
* __dummies__ - just fill a place 
* __stub__ -object has controllable behavior
* __spies__ keeps track how many times object called, which object and parameters are used
    * used the most
* __true mock__ - complex test I was called, I was called x times, with x paramaeters

## Unit Testing Types
* __isolation__ -  test component only
* __integration__ - test component with its template


## Tools
* karma - run tests in browser
* jasimne - test framework

### Additional
* mocha,jest
* Sinon - if jasmine is not good enough

## First unit test
* use describe describe it block for 3 logical steps
[first test](ngUnitTestingDemo\src\app\first-test.spec.ts)
* use npm test in order to test 
* open on localhost:9876

## Writing Good unit tests
* __aaa pattern__ - arrange, act,assert
* set inital state, change state , make sure new state is correct
* DAMP -repeat yourself if necessary
* should look around much to understand the it
    * keep critical setup in the it


#  Isolated Unit Testing

## test a pipe
* just remove the @Component and test as a regular class
* [strength pipe](ngUnitTestingDemo\src\app\strength\strength.pipe.ts)
* test if transform takes number and returns a string
* test every exit point 

# Test A Service
* [message service](ngUnitTestingDemo\src\app\message.service.spec.ts)
* make sure you have an act and assert, resetting state is part of act because its not inital state


# Test A Component
* [heroes component](ngUnitTestingDemo\src\app\heroes\heroes.component.spec.ts)
* you need a fake service
* you need a delete method of the mocked service
* can also use lifecycle hooks to help out
* avoid running test by using xit

## State Based
since heroes componet uses getHeroes', 'addHero', 'deleteHero' from heroservice
make a mock like this
```ts
  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful', strength: 24},
      {id: 3, name: 'SuperDude', strength: 55}
    ]
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    component = new HeroesComponent(mockHeroService);
  });
```

* also you need the method to have the return value of the type
so if mockSerivce.getHeroes returns Observable<boolean> do like this

```ts
mockHeroService.deleteHero.and.returnValue(of(true));
```
## Interatction test

* use this to check if a specfic method has been called
```ts
expect(mockHeroService.deleteHero).toHaveBeenCalled()
expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
```

# Shallow Integration Tests
* make sure keep browser is open
* needed detectChanges in integration tests
* fixture.detectChanges(); may call ngOnInit

## TestBed

[hero componenet](ngUnitTestingDemo\src\app\hero\hero.component.shallow.spec.ts)

* TestBed.configureTestingModule refer to app.module
* use schemas to angular how to process its HTML
    * NO_ERRORS_SCHEMA, means to silience things like routerLink and missing routermodule provide
* fixture.nativeElement is a dom HTMLElement
* after you set properties related to HTML bindings use     fixture.detectChanges(); to update bindings

## Debug Element
* there is query, queryAll
```ts
fixture.debugElement.query(By.css('a'))
fixture.debugElement.queryAll(By.css('a'))
```

* there is By from angular-platform browser
mainly By.css,By.directive

## Complex Shallow Integration
* [heroes component](ngUnitTestingDemo\src\app\heroes\heroes.component.spec.ts)

* there are the HeroService and the children compoents you need to worry about
* mock the injected service
```ts
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      providers: [
        {provide: HeroService, useValue: mockHeroService}
      ]
    });
```

* dont use NO_ERROS_SCHEMA here because you are testing the html tests is correct
* mock the child component

```ts
  @Component({
    selector: 'app-hero',
    template: '<div class="badge">{{hero.id}}</div> {{hero.name}}',
  })
  class FakeHeroComponent { // could be real hero but its obvious its fake
    @Input() hero: Hero;
  }


// in before Each
mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    TestBed.configureTestingModule({
      declarations: [HeroesComponent,FakeHeroComponent],
      providers: [
        {provide: HeroService, useValue: mockHeroService}
      ]
    });
// 
```
## Lists of elements

# Deep Integration Tests
 * use fixture.detectChanges(); for change detection in beforeEach
 * will run ngOnit for all child components

 * [heroes component](ngUnitTestingDemo\src\app\heroes\heroes.component.spec.ts)

 # Integration Testing of Services
 * [hero service](ngUnitTestingDemo\src\app\hero.service.spec.ts)


controller.expectOne, dones'nt make a http request happen on its on
it also expects a request to be made
also expect the test not to make any xhr than the string arg

req.flush , decides what data to send back when call is made

# Testing DOM Interaction and Routing Components
 * [heroes component](ngUnitTestingDemo\src\app\heroes\heroes.component.spec.ts)

* jasmine.spyOn - look for fn on component and see if its watched
* unfortanly routing test is flaky

## Emitting events from children
* hey you have an event just raise it
* just test the boundaries

## Interact with Input Boxes
[hero detail compeont](ngUnitTestingDemo\src\app\hero-detail\hero-detail.component.spec.ts)

## Tested with ActivatedRoute
* your should not check the framework  works
* asusme framework works correctly
* formsmodule is not to difficult



# Advanced topics

## Adding Async code
 * debounce fn
 ```ts
  debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
 ```

 * use done paramater to let jasmine know its async


 ## Fake Async helper 

 * fakeAsync 
 * fast forward through time
 angular runs in zone, when you use fakeAsync you run in a different zone where you can control the passage of time with the tick fn
 * if we dont know how long use flush fn

 ## Wait for async

 * used with promises
* __fixture.whenStable()__ - when all promises has resolved its a promise itself


## Coverage Report
* snapshot of current unit test state
```
npx ng test --no-watch --code-coverage
```
* coverage/[project name]
* on matteers is index.html
* code coverage only knows about code that gets loaded
* in production this a less of an issue