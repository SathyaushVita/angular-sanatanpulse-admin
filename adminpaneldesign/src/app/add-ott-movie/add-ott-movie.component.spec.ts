import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOttMovieComponent } from './add-ott-movie.component';

describe('AddOttMovieComponent', () => {
  let component: AddOttMovieComponent;
  let fixture: ComponentFixture<AddOttMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOttMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOttMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
