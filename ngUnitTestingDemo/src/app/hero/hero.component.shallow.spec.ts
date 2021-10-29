import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { By } from "@angular/platform-browser";
import { HeroComponent } from "./hero.component"

describe('HeroComponent (shallow tests)',()=>{

  let fixture: ComponentFixture<HeroComponent>;
  beforeEach(()=>{
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas:[NO_ERRORS_SCHEMA]
    })
    fixture = TestBed.createComponent(HeroComponent)

  })

  it('should have the correct hero',()=>{
    fixture.componentInstance.hero = {id:1,name:'SuperDude',strength:3};
    fixture.detectChanges();
    expect(fixture.componentInstance.hero.name).toEqual('SuperDude')
  })

  it('should render the hero name in an anchor tab',()=>{
    fixture.componentInstance.hero = {id:1,name:'SuperDude',strength:3};
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude')

    // using angular  debug element
    let deA = fixture.debugElement.query(By.css('a'));
    expect(deA.nativeElement.innerText).toContain('SuperDude')

  })
})
