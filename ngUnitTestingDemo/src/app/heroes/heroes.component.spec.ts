import { Component, DebugElement, Directive, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import  {HeroesComponent} from './heroes.component';


@Directive({
  selector: '[routerLink]',
  host:{'(click)':'onClick'}
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo:any = "issue";
  onClick() {
    this.navigatedTo = this.linkParams;
  }
  // empty
}



describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful', strength: 24},
      {id: 3, name: 'SuperDude', strength: 55}
    ]
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    component = new HeroesComponent(mockHeroService);
  });

  describe('delete',()=>{

    // state based test
    // check the component changes
    it('should remove the indicated hero from the heroes list',()=>{
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;
      component.delete(HEROES[2]);
      expect(component.heroes.length).toBe(2);
    })

    // interaction test
    it('should call deleteHero',()=>{
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;
      component.delete(HEROES[2]);
      expect(mockHeroService.deleteHero).toHaveBeenCalled()
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);

    })
  })
})


describe('HeroesComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;
  let component: HeroesComponent;

  @Component({
    selector: 'app-hero',
    template: '<div class="badge">{{hero.id}}</div> {{hero.name}}',
  })
  class FakeHeroComponent { // could be real hero but its obvious its fake
    @Input() hero: Hero;
  }

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful', strength: 24},
      {id: 3, name: 'SuperDude', strength: 55}
    ]
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    TestBed.configureTestingModule({
      declarations: [HeroesComponent,FakeHeroComponent],
      providers: [
        {provide: HeroService, useValue: mockHeroService}
      ]
    });
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
  });

  it('should set heroes correctly from the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    expect(component.heroes.length).toBe(3);
  });

  it('should create 1li for each hero',()=>{
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(3);
  })
})


describe('Heroes Component (deep integration)',()=>{
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;
  let component: HeroesComponent;


  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful', strength: 24},
      {id: 3, name: 'SuperDude', strength: 55}
    ]
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        {provide: HeroService, useValue: mockHeroService}
      ],
      // schemas:[NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
  });

  it('should render each hero as a hero component',()=>{
    let heroDEs:DebugElement[] = fixture.debugElement.queryAll(By.directive(HeroComponent))
    expect(heroDEs.length).toEqual(3)

    heroDEs
    .forEach((x:DebugElement,i)=>{
      expect(x.componentInstance.hero).toEqual(HEROES[i])
    })
  })

  it('should call deleteHero when the hero component\'s delete button is clicked',()=>{
    spyOn(component,'delete');
    fixture.detectChanges();
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    // e2e
    // heroComponents[0].query(By.css('button'))
    //   .triggerEventHandler('click',{stopPropagation:()=>{}});

    // raise the event manually
    heroComponents[0].componentInstance.delete.emit(null);

    // debugElement to raise the event dk if child has delete method
    // heroComponents[0].triggerEventHandler('delete',null);


    expect(component.delete).toHaveBeenCalledWith(HEROES[0]);
  })

  it('should add a new hero to the hero list when the add button is clicked',()=>{
    const name = 'Mr. Ice';
    mockHeroService.addHero.and.returnValue(of({id:5,name:name,strength:4}));
    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    // simulate typing
    inputEl.value = name;
    addButton.click();
    fixture.detectChanges();

    expect(component.heroes.length).toEqual(4);
    expect(component.heroes[3].name).toEqual(name);
  })

  xit('should have the correct route for the first hero ',()=>{
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    const routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click',null);
    // heroComponents[0].triggerEventHandler('click',null);


    expect(routerLink.navigatedTo).toBe('/detail/1');
  })
})
