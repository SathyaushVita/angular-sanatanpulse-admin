import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OttplatformComponent } from './ottplatform.component';

describe('OttplatformComponent', () => {
  let component: OttplatformComponent;
  let fixture: ComponentFixture<OttplatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OttplatformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OttplatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
