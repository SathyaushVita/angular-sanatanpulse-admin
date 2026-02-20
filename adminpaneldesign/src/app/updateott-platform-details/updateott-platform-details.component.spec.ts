import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateottPlatformDetailsComponent } from './updateott-platform-details.component';

describe('UpdateottPlatformDetailsComponent', () => {
  let component: UpdateottPlatformDetailsComponent;
  let fixture: ComponentFixture<UpdateottPlatformDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateottPlatformDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateottPlatformDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
