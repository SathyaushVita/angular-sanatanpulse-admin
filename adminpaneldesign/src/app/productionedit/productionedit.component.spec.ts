import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductioneditComponent } from './productionedit.component';

describe('ProductioneditComponent', () => {
  let component: ProductioneditComponent;
  let fixture: ComponentFixture<ProductioneditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductioneditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductioneditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
