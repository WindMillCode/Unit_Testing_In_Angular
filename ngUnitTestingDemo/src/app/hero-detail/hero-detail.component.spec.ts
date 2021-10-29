import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import {Location} from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";
import { Directive, Input } from "@angular/core";



describe('HeroDetailComponent',()=>{




  let mockActivatedRoute ={
    snapshot:{
      paramMap:{
        get():string{
          return '3';
        }
      }
    }
  };
  let mockHeroService = jasmine.createSpyObj(['getHero', 'saveHero','updateHero']);
  let mockLocation = jasmine.createSpyObj(['back']);
  let fixture:ComponentFixture<HeroDetailComponent>;
  beforeEach(()=>{
    TestBed.configureTestingModule({
      declarations: [ HeroDetailComponent ],
      imports:[FormsModule],
      providers:[
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: HeroService, useValue: mockHeroService},
        {provide: Location, useValue: mockLocation}
      ]
    });
    fixture= TestBed.createComponent(HeroDetailComponent);
    mockHeroService.getHero.and.returnValue(of({id:3, name:'SuperDude', strength:100}));
  })

  it('should render hero name in a h2 tag',()=>{

    // arrange
    fixture.detectChanges();
    // assert
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
  })

  // if we have 10 of the that may 3 seconds of unit tests doing nothing that is very bad
  xit('should call updateHero when save is called',(done)=>{
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();

    setTimeout(()=>{
      expect(mockHeroService.updateHero).toHaveBeenCalled();
      done()
    },300)

  })

  it('should call updateHero when save is called',fakeAsync(()=>{
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    // when you know the amnt of time
    // tick(250);

    // when you dont know the amnt of time
    flush()

    expect(mockHeroService.updateHero).toHaveBeenCalled();


  }))

  it('should call updateHero when save2 is called',waitForAsync(()=>{
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save2();
    fixture.whenStable().then(()=>{
      expect(mockHeroService.updateHero).toHaveBeenCalled();

    })


  }))
})
