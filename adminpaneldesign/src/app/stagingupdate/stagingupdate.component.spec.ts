import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagingupdateComponent } from './stagingupdate.component';

describe('StagingupdateComponent', () => {
  let component: StagingupdateComponent;
  let fixture: ComponentFixture<StagingupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagingupdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StagingupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
